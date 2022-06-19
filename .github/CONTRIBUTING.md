Cookie Monster is written to modify Cookie Clicker as little as possible. This means the data is copied to simulate instead of actually modifying the current values and reverting later. The benefit is that CM should never mess up any data. The downside is that there is an extra overhead to copy and store the copied data.

The following is a short description of the various `src` directories and their contents:

| JS           | Description                                                                |
| ------------ | -------------------------------------------------------------------------- |
| Cache        | Functions related to creating and storing data cache                       |
| Config       | Functions related to manipulating CM configuration                         |
| Data         | Hard coded values                                                          |
| Disp         | Functions related to displaying CM's UI                                    |
| InitSaveLoad | Functions related to registering the CM object with the Game's Modding API |
| Main         | Functions related to the main loop and initializing CM                     |
| Sim          | Functions related to simulate something                                    |

These are some additional guidelines:

- Try to use DOM as much as possible instead of using string manipulation to modify HTML.
- Please be descriptive of your commits. If the commit is related to an issue or PR, please add the issue/PR number to the commit message.
- PR's should target the `dev` branch
