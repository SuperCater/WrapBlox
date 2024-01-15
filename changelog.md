# Changelog

All notable changes to this project will be documented in this file.
Date format is `MM/DD/YYYY`.

## [Unreleased]

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
