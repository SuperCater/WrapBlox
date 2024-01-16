# Changelog

All notable changes to this project will be documented in this file.
Date format is `MM/DD/YYYY`.

## [0.2.1b] - 1/16/2024

### Fixed

- i actually fixed the types this time

## [0.2.1a] - 1/16/2024

### Fixed

- Bug where types were not exported and would cause errors

## [0.2.1] - 1/16/2024

### Changed

- Types are now exported from index.ts

## [0.2.0] - 1/16/2024

### Added

- getGroup() method to get a group via ID
- getGroupAuditLogs() method to get a group's audit logs
- getGroupNameHistory() method to get a group's name history
- patch() method to send a PATCH request
- getGroupSettings() method to get a group's settings
- updateGroupSettings() method to set a group's settings
- getGroupsMetadata() method to get groups metadata
- getSelfGroupMetadata() method to get the current user's groups metadata
- updateGroupDescription() method to update a group's description
- options param to constructor to set some options
- Wrapblox.settings object for settings
- Wrapblox.settings.debugMode to enable debug mode
- updateGroupName() method to update a group's name
- setGroupStatus() method to set a group's status
- setGroupShout() method to set a group's shout (same as setGroupStatus())
- delete() method to send a DELETE request
- declineJoinRequests() method to batch decline join requests
- getJoinRequests() method to get a list of join requests
- acceptJoinRequests() method to batch accept join requests
- declineJoinRequest() method to decline a join request
- getJoinRequest() method to get a join request
- acceptJoinRequest() method to accept a join request
- isLoggedIn() method to check if the user is logged in
- getGroupRoles() method to get a list of roles for a group
- getGroupRoleMembers() method to get a list of members for a group role
- getGroupMembers() method to get a list of members for a group
- useErrors option to constructor to throw errors instead of returning undefined
- FAQ section to readme.md
- why to use wrapblox section to readme.md
- getSelfPendingGroups() method to get a list of pending groups for the current user
- getFriendGroups() method to get a list of groups for a users friends
- getUsersRoles() method to get a list of roles for a user
- changeGroupOwner() method to change a group's owner
- claimGroupOwnership() method to claim ownership of a group
- exileUserFromGroup() method to exile a user from a group
- setUsersRole() method to set a user's role
- getPayoutRestrictions() method to get a group's payout restrictions
- getGroupPayoutPercentages() method to get a group's payout percentages for users
- getRoles() method to get a list of roles
- getRole() method to get a role via ID
- testing with jest

### Fixed

- readme.md incorrect usage of `getUser()`


## [0.1.0] - 1/15/2024

### Added

- getCurrentUserRoles() method to get the current user's roles
- changelog
- getSelf() method to get the current user's information
- getUsers() method to get a list of users via IDs
- getUsersByUserNames() method to get a list of users via usernames
- getGroups() method to get a list of groups via IDs
- groups base URL
- groups2 base URL
- getWallPosts() method to get a list of wall posts
- getUserRoles() method to get a list of roles for a user

## [0.0.1] - 1/14/2024

### Added

- Initial release
