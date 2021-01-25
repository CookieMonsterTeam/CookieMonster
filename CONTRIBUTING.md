The following is a description of the our approach to the project.

Cookie Monster is written to modify Cookie Clicker as little as possible.  This means the data is copied to simulate instead of actually modifying the current values and reverting later.  The benefit is that CM should never mess up any data.  The downside is that there is an extra overhead to copy and store the copied data.

Here is a description of what should be stored in each of the source JS. Make edits to the source file first and then use the combine file to compile the final file:

JS | Description
-- | -
Cache | Functions related to creating and storing data cache
Config | Functions related to manipulating CM configuration
Data | Hard coded values
Disp | Functions related to displaying CM's UI
Footer | The footer of CM's JS (not modified often or ever)
Header | The header of CM's JS (not modified often or ever)
Main | Functions related to the main loop and initializing CM
Sim | Functions related to simulate something

These are some additional guidelines:
- Try to use DOM as much as possible instead of using string manipulation to modify HTML.
- Please be descriptive of your commits.  If the commit is related to an issue or PR, please add the issue/PR number to the commit message.
- Try to follow the formatting and annotation as specified by JSCode
- PR's should target the `dev` branch
