---
title: Edit an app database in BlueStacks via ADB
tags: bluestacks, adb, sqlite, android
---

Path: C:\ProgramData\BlueStacks_nxt\Engine\Pie64

Extract, Edit, and Push via ADB (Recommended). This approach bypasses file system limitations by pulling the database file directly out of the running emulator, editing it on your PC, and pushing it back.

1. Enable ADB in BlueStacks: Settings -> Preferences, check "Enable Android debugging (ADB)". Note the port number (usually 5555).
2. Pull the database file to your PC. In Command Prompt:

adb connect 127.0.0.1:5555
adb shell "su -c 'cp /data/data/<your.app.package>/databases/love_db /sdcard/love_db'"
adb pull /sdcard/love_db C:\Users\YourUsername\Desktop\love_db

(Replace <your.app.package> with the actual bundle ID of the app.)
3. Edit the database: open love_db in an SQLite editor (such as DB Browser for SQLite), make your edits, and save.
4. Push the updated file back:

adb push C:\Users\YourUsername\Desktop\love_db /sdcard/love_db
adb shell "su -c 'cp /sdcard/love_db /data/data/<your.app.package>/databases/love_db'"

5. Verification: restart the app inside BlueStacks to confirm your modifications load correctly.
