![Post](https://next-s3-public.s3.us-west-2.amazonaws.com/social/estuary.hero.large.png)

# Estuary WWW

A website that can communicate to any [Estuary](https://github.com/application-research/estuary) node. You can make Filecoin storage deals with an Estuary node.

## Development

Make sure NodeJS 10+ is installed. Then run:

```sh
npm install
npm run dev-production
```

Now view [localhost:4444](http://localhost:4444) in your browser.

**Note:** If you are using another port for your estuary node other than the default port (`localhost:3004`), you can set the `ESTUARY_API` environment variable to point to the right URL. for example. to change to port 9999
```bash
$ ESTUARY_API=http://localhost:9999 npm run dev
```

## Troubleshooting
The estuary-www frontend was built using modern day frontend technologies that requires different modules. Some of the modules may or may not be dependent on the host operating system architecture or kernel and this can cause 
issues when running the app.

### Issue: Unhandled Runtime error
This happens when estuary-www failed to connect to estuary backend. Make sure that ESTUARY_API is set to estuary host ip and port.
![image](https://user-images.githubusercontent.com/4479171/168707524-afd12111-e84c-4746-a291-6d5b3a3121c9.png)

- If you are running a single local estuary node, this will use http://localhost:3004. 
- You will need to set the ESTUARY_API to http://localhost:3004 (export ESTUARY_API=http://localhost:3004). 
- Running `npm run dev` will automatically set the ESTUARY_API to localhost.

### Issue: Missing modules, webpack modules
There are instances were in webpack global modules are used by different projects and this can cause some conflict with estuary-www. If you ran into an issue, run the following command
```
npm install -g webpack-dev-server
```

## Contributing to estuary-www

Please refer to each project's style and contribution guidelines for submitting patches and additions. In general, we follow the "fork-and-pull" Git workflow.

1. **Fork** the repo on GitHub
2. **Clone** the project to your own machine
3. **Commit** changes to your own branch
4. **Push** your work back up to your fork
5. Submit a **Pull request** so that we can review your changes

NOTE: Be sure to merge the latest from "upstream" before making a pull request!


## Questions?

Twitter: [@wwwjim](https://twitter.com/wwwjim).

You can also find our team on [slack](https://filecoinproject.slack.com/archives/C016APFREQK)
