# README

## Description

## Features

## Dev Tips

### Forgot Password Workflow

1. User submits their email as a "forgot password" request from Flutter app, a dialog tells them to check email.

2. Email is sent to the user with a link containing new emailToken.

3. User submits this token using the Forgot Password page along with a new password.

4. If token is OK, new password is saved and user can login.

### Deploying to Coolify

1. Commit and push all changes to master branch.

2. Coolify should be auto-build and deploy latest version of the app when changes are pushed.

3. Use the Coolify Dashboard to monitor or check deployment status.
