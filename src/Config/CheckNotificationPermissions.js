/**
 * This function checks if the user has given permissions for notifications
 * It is called by a change in any of the notification options
 * Note that most browsers will stop asking if the user has ignored the prompt around 6 times
 * @param 	{number}	ToggleOnOff		A number indicating whether the option has been turned off (0) or on (1)
 */
function CheckNotificationPermissions(ToggleOnOff) {
  if (ToggleOnOff === 1) {
    // Check if browser support Promise version of Notification Permissions
    const checkNotificationPromise = function () {
      try {
        Notification.requestPermission().then();
      } catch (e) {
        return false;
      }
      return true;
    };

    // Check if the browser supports notifications and which type
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications.'); // eslint-disable-line no-console
    } else if (checkNotificationPromise()) {
      Notification.requestPermission().then();
    } else {
      Notification.requestPermission();
    }
  }
}

export default CheckNotificationPermissions;
