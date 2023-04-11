## Quick Start
`curl -fsSL https://downloads.slack-edge.com/slack-cli/install.sh | bash` # Install deno

On Paid plan `slack login`

`slack create <app-name> (--template <one of https://api.slack.com/future/samples>)`

(`cd <app-name> && slack run`, Paste "Shortcut URL" to slack channel)


## Manifest
~~
- botScopes | Array of Strings | A list of bot scopes, or permissions, the app's functions require
- displayName | String | (Optional) A custom name for the app to be displayed that's different from the name
- longDescription | String | (Optional) A more detailed description of your application
- backgroundColor | String | (Optional) A six digit combination of numbers and letters (the hexadecimal color code) that make up the color of your app background e.g., "#000000" is the color black
- functions | Array | (Optional) A list of all functions your app will use
- workflows | .. workflows
- outgoingDomains | Array of Strings | (Optional) As of v1.15.0: if your app communicates to any external domains, list them here. If you make API calls to slack.com, it does not need to be explicitly listed. e.g., myapp.tld
- events | Array | (Optional) A list of all event structures that the app is expecting to be passed via Message Metadata
- types | Array | (Optional) A list of all custom types your app will use
- datastores | .. Datastores
- features | Object | (Optional) A configuration object of your app features
  - Exp)`SendDm` send users direct messages appear in the app's Messages tab.
    Your app's Messages(, About) tab enabled and read-only by default
    `features: { appHome: { messagesTabEnabled: false, messagesTabReadOnlyEnabled: false } }` -> disable read-only mode and/or disable the Messages tab completely


## Functions
15 sec timeout per each function
### Builtin function reference: https://api.slack.com/reference/functions/builtins
### Custom
#### Function Definition
```ts
export const GreetingFunctionDefinition = DefineFunction({
  callback_id: "unique in app",
  title: "",
  description: "optional",
  source_file: "functions/greeting_function.ts",
  input_parameters: {
    properties: {
      <property>: {
        type: Schema.slack.types.user_id, //https://api.slack.com/future/types (/custom)
        description: "Greeting recipient",
      },
      <custom-property>: DefineProperty({
         type: Schema.types.object,
         properties: {
           message_ts: { type: Schema.types.string },
           channel_id: { type: Schema.types.string },
           user_id: { type: Schema.types.string },
         },
         required: ["message_ts"]
       })
    }
  },
  output_parameters: // same structure as `input_parameters`
});
```

#### Function Implementation
- Context properties
  - env | String | Represents environment variables available to your function's execution context. These are added via the CLI's env add command.
  - inputs | Object | Contains the input parameters you defined as part of your function definition.
  - client | Object | An API client ready for use in your function. Useful for calling Slack API methods.
  - token | String | Your application's access token.
  - event | Object | Contains the full incoming event details.
  - team_id | String | The ID of your Slack workspace, i.e. T123ABC456.
  - enterprise_id | String | The ID of the owning enterprise organization, i.e. "E123ABC456". Only applicable for Slack Enterprise Grid customers, otherwise its value will be set to an empty string.

- Output properties
  - error | String | Indicates the error that was encountered. If present, the function will return an error regardless of what is passed to outputs.
  - outputs | Object | Exactly matches the structure of your function definition's output_parameters. This is required unless an error is returned.
  - completed | Boolean | Indicates whether or not the function is completed. This defaults to true.

#### Distribute
deploy once -> `slack function distribute` -> redeploy


## Workflow
Workflow Definition Similar properties with Function Definition
Include functions with `addStep`
Declare in manifest.ts


## Trigger https://api.slack.com/future/triggers/
Define trigger file and `slack trigger create <necessary flags>` returns properties
Trigger: Link, Scheduled, Webhook, Event  https://api.slack.com/future/metadata-events


## Other new apis
Datastores https://api.slack.com/future/datastores

External Auth https://api.slack.com/future/external-auth

Form https://api.slack.com/future/forms
Block Kit https://api.slack.com/future/block-events
Modal https://api.slack.com/future/view-events

## Traditional Slack apps

Tutorials https://api.slack.com/tutorials
Create app https://api.slack.com/apps

References
Scopes https://api.slack.com/scopes
Web API methods https://api.slack.com/methods
API object types https://api.slack.com/types
Event types https://api.slack.com/events
