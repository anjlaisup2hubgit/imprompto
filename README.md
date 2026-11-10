# Imprompto

Imprompto is a place to keep the messages you type to an AI helper.

## Download

Open the app in any web browser, on your phone or your computer. There is nothing to install.

https://imprompto.pages.dev

To get your own copy of the code, run this in a terminal.

```bash
git clone https://github.com/anjlaisup2hubgit/imprompto.git
```

## Features

- **Flower:** the home page shows a flower. Each petal is a group of prompts, and you tap a petal to see them.
- **Search:** type any word you remember and the matching prompts show up.
- **Copy:** tap a prompt and it is copied, so you can paste it anywhere.
- **Add your own:** press "+ New prompt" to save a prompt of your own. You can change it or delete it later.
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
├── prompts/       the starter prompts, sorted into design, general, how-to and writing
├── assets/        the flower picture
├── mockups/       early drawings of how the website could look
├── screenshots/   photos of the app, used to check how it looks
├── template.html  the empty page before the prompts are put in
├── build.py       the tool that puts everything together into the finished website
├── schema.sql     the plan for how saved prompts are stored
└── wrangler.toml  the settings for the website's online home
```
