
# Deploying

Open two terminal sessions, one inside the `./frontend` directory, and one inside the `./backend` directory.

From within `./frontend`, run the following:

```bash
npm install
npm run build
```

From within `./backend`, run the following:

```bash
npm install
node ./index.ts
```

# Using the Agenda

First, you need to create an account. You do this by entering your desired username and password, then clicking "create account". If it was successful, the username and password fields should be cleared. (I know, not the most intuitive, but it's just a POC.) All data is stored locally on your filesystem and encrypted by your password.

To log in, you enter your username and password, then press "log in". If your username and password match, your agenda will be opened. If your credentials don't match, then nothing happens. (Again, not the most intuitive. It was a timeboxed POC. Sorz.)

There are 5 types of items the agenda tracks:

| Item Type   | Text Color | Shown in Month View | Shown in Day View |
| :---------- | :--------- | :-----------------: | :---------------: |
| Task        | Black      |                     | ✅                |
| Minor Event | Green      |                     | ✅                |
| Major Event | Blue       | ✅                  | ✅                |
| Deadline    | Red        | ✅                  | ✅                |
| Goal        | Black      | ✅                  |                   |

**Major and minor events** can span multiple days, whereas the other item types only exist on a single day. Additionally, events "auto-complete" on the day after the event, but the other item types you need to manually check off as "complete".

**Goals** are meant to be things you're aiming to complete or improve that month. They might be:

* Larger things comprised of many tasks (ex: "Create a video about penguins")
* Smaller things that are unusual but you don't want to forget (ex: "Schedule oil change")
* General reminders to yourself (ex: "Run 3 days per week")

The other item types (**tasks** and **deadlines**) are pretty straightforward. Tasks are daily tasks you can check off, and deadlines are v important tasks that need to be completed by a certain date.

## Quality of Life Hotkeys

To make it quicker to create items, the following hotkeys exist:

* `t` to create a task
* `E` to create a major event
* `e` to create a minor event
* `d` to create a deadline
* `g` to create a goal
* `Esc` to exit out of the creation dialog

# Developing

Similar to deploying, open two terminal sessions, one inside the `./frontend` directory, and one inside the `./backend` directory.

From within `./frontend`, run the following:

```bash
npm install
npm run dev
```

From within `./backend`, run the following:

```bash
npm install
node ./index.ts
```