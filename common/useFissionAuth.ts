import { useEffect, useState } from 'react'

import * as webnative from 'webnative'
import * as webnativeFilecoin from 'webnative-filecoin';

import * as C from '@common/constants';
import * as R from '@common/requests';

import Cookies from 'js-cookie';

webnative.setup.debug({ enabled: true })

export function useFissionAuth({ host, protocol }) {
  const [state, setState] = useState<webnative.State>(null)
  let fs;
  let authScenario: webnative.Scenario | null = null;
  let username: string = null;


  /** Webnative Initialization
   * Load webnative and configure permissions.
   */

  useEffect(() => {
    async function getState() {
      const result = await webnative.initialise({
        permissions: {
          // The Estuary token is stored in app storage
          // at bgins/estuary-www.
          app: {
            name: 'estuary-www',
            creator: 'arg',
          },
          fs: {
            // The cosigner key is stored in the private filesystem
            // at the path Keychain/fil-cosigner.
            private: [webnative.path.file('Keychain', 'estuary-fil-cosigner')]
          }
        },
      })
      setState(result)
    }

    getState()
  }, [])


  /** User and filesystem initialization
   * If the user is authenticated with Fission, set their authScenario,
   * filesytem, and username.
   */

  switch (state?.scenario) {
    case webnative.Scenario.AuthSucceeded:
    case webnative.Scenario.Continuation:
      authScenario = state.scenario;
      fs = state.fs;
      username = state.username;
      break;

    default:
      break;
  }


  /** Authorize
   * Redirect the user to the Fission auth lobby where permission to use
   * their filesystem will be requested. If they are new to Fission, they will
   * first be asked to create an account.
   */

  const authorise = (redirectBackTo: string) => {
    if (state) {
      webnative.redirectToLobby(state.permissions, `${protocol}://${host}/${redirectBackTo}`)
    }
  }


  /** Sign in
   * If the user is signed in with Fission, but not signed into Estuary, retrieve their
   * Estuary token from WNFS. The token is stored encrypted at rest in WNFS.
   * The stored token will be invalidated the next time that the user signs out, so we
   * request a new token and store it in WNFS for the next sign in.
   */

  const signIn = async () => {
    if (fs) {
      // Auth with stored token
      const token = await readToken()

      if (token) {
        // Set the token
        Cookies.set(C.auth, token);

        // Request a new token for the next time the user signs in
        const j = await R.post(`/user/api-keys`, {});
        if (j.error) {
          return j;
        }

        if (!j.token) {
          return {
            error: 'Our server failed to sign you in. Please contact us.',
          };
        }

        // Store the new token in WNFS
        const tokenPath = fs.appPath(webnative.path.file(C.auth));
        await fs.write(tokenPath, j.token);
        await publish(tokenPath);

        window.location.href = '/home';
        return;
      } else {
        return {
          error: 'We could not find your credentials stored with Fission. Please contact us.',
        };
      }
    } else {
      return {
        error: 'We could not load your webnative file system. Please contact us.',
      };
    }
  }


  /** Read token
   * Read the token from WNFS if it exists. Otherwise, return null to indicate
   * that we don't have one.
  */

  const readToken = async () => {
    if (fs) {
      const tokenPath = fs.appPath(webnative.path.file(C.auth));

      if (await fs.exists(tokenPath)) {
        const token = await fs.read(tokenPath)
        return token;
      } else {
        return null;
      }
    }
  }


  /** Publish
   * Publish local changes to the user's filesystem on IPFS.
   * This is a blocking implementation that should not be typically used, but we 
   * use here to make sure we store tokens before changing window.location.href.
   * 
   * See the WNFS guide for the non-blocking implemenation of publish: 
   * https://guide.fission.codes/developers/webnative/file-system-wnfs
   * 
   */

  const publish = async (path) => {
    if (fs) {
      const cid = await fs.root.put();
      const ucan = await webnative.ucan.dictionary.lookupFilesystemUcan(path);
      await webnative.dataRoot.update(cid, ucan);
    } else {
      return {
        error: 'We could not load your webnative file system. Please contact us.',
      };
    }
  }

  return { authorise, authScenario, fs, publish, readToken, signIn, username }
}
