# Imprompto

## Link

https://imprompto.pages.dev

## File tree

```
organiser/
├── public/      the website you see
├── functions/   the small server that saves your prompts
├── prompts/     the starter prompts (design, general, how-to, writing)
├── assets/      the flower picture
├── mockups/     early drawings of the website
├── reference/   pictures used for the look
├── template.html  the page before the prompts are added
├── build.py     puts the prompts into the page
├── schema.sql   the shape of the saved data
└── wrangler.toml  the Cloudflare settings
```

## Features

- **Flower:** each petal is a group of prompts. Click one to see them.
- **Search:** type any word you remember and the prompts appear.
- **Copy:** click a prompt, or press Enter, and it is copied.
- **Add your own:** press "+ New prompt" to save one. You can edit or delete it later.
- **On every device:** your prompts are saved online, so your phone and PC show the same ones.
- **Sign in:** anyone can sign in with their email code, and each person sees only their own prompts.
- **Private:** you must sign in with an email code to open it.

## Where things live
- `pages/` holds the screens (home, results, the add-prompt form).
- `components/` holds shared pieces (search, petals, dialog, buttons).
- `data/` holds saving and loading (your prompts, browser storage, cloud sync).
- `build.py` joins these small files into `public/index.html`. Run `python build.py` after any change.
