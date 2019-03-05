# Azure DevOps PullRequest Monitor

[![Build Status](https://travis-ci.org/harunhasdal/vsts-pr-monitor-chrome.svg?branch=master)](https://travis-ci.org/harunhasdal/vsts-pr-monitor-chrome)

This is a chrome extension which would monitor all the repositories in a given Azure DevOps account for active Pull Requests and lists them as links so that the developers can monitor what needs to be reviewed.

## Usage

Click on SETTINGS link to configure the extension with your Azure DevOps account (required), project and repository filters.

If you'd like to monitor multiple repositories accross multiple projects, you can use regular expressions to filter your projects and repositories.

Note that you'll need to have an active session with Azure DevOps in order to retreive the list of pull requests.

## Development

The popup page of this application is using lit-element and lit-html.
