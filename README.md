![Post](https://next-s3-public.s3.us-west-2.amazonaws.com/social/estuary.hero.large.png)

# Estuary WWW

A website that can communicate to any [Estuary](https://github.com/application-research/estuary) node. You can make Filecoin storage deals with an Estuary node.

## Development

Make sure NodeJS 10+ is installed. Then run:

```sh
npm install
npm run dev-production
```

Now view localhost:4444 in your browser.

**Note:** If you are using another port for your estuary node other than the default port (`localhost:3004`), you can set the `ESTUARY_API` environment variable to point to the right URL. for example. to change to port 9999
```bash
$ ESTUARY_API=http://localhost:9999 npm run dev
```



## Questions?

Twitter: [@wwwjim](https://twitter.com/wwwjim).
