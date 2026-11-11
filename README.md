# Imprompto

A storage space for your prompts.

## Download

For developers:

```bash
git clone https://github.com/anjlaisup2hubgit/imprompto.git
```

## Features

- **Flower:** the home page shows a flower. Each petal is a group of prompts, and you tap a petal to see them.
- **Search:** type any word you remember and the matching prompts show up.
- **Copy:** tap a prompt and it is copied, so you can paste it anywhere.
- **Add your own:** press "+ New prompt" to save a prompt of your own. You can change it or delete it later.
- **Any number of groups:** type a new group name when you save a prompt, and extra groups wait in a sliding row under the flower.
- **Rename a group:** open a group and press "Rename category" to give it a new name.
- **Delete and trash:** delete any prompt and it moves to the Trash, where you can bring it back for 30 days or delete it for good.
- **Same on every device:** your prompts are saved online, so your phone and your computer show the same ones.
- **Private:** you sign in with a code sent to your email, and you only see your own prompts.

## File tree

```
imprompto/
├── public/        the finished website that people open
├── pages/         the screens you look at (home, results, add-a-prompt form)
├── components/    small pieces used on many screens (search, petals, buttons, pop-ups)
├── data/          saving and loading your prompts
├── functions/     the small helper on the internet that keeps your prompts safe
├── prompts/       the starter prompts, sorted into category1, category2, category3 and category4
├── assets/        the flower picture
├── screenshots/   photos of the app, used to check how it looks
├── template.html  the empty page before the prompts are put in
├── build.py       the tool that puts everything together into the finished website
├── schema.sql     the plan for how saved prompts are stored
└── wrangler.toml  the settings for the website's online home
```
