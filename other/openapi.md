# JSON Schema

- The top level `$id` must be an absolute path

- JSON Pointer (like: 'https://example.com/schemas/address#/properties/street_address')
- $anchor (specify $anchor value with hash (#) in JSON Pointer)

- Recursion `"$ref": "#"`. $ref referring to another $ref is disallowed.

```json
{
  "$id": "https://example.com/schemas/customer",
  "$schema": "https://json-schema.org/draft/2020-12/schema",

  "type": "object",
  "properties": {
    "first_name": { "type": "string" },
    "last_name": { "type": "string" },
    "shipping_address": { "$ref": "/schemas/address" },
    "billing_address": { "$ref": "/schemas/address" }
  },
  "required": ["first_name", "last_name", "shipping_address", "billing_address"],

  "$defs": {
    "address": {
      "$id": "/schemas/address",
      "$schema": "http://json-schema.org/draft-07/schema#",

      "type": "object",
      "properties": {
        "street_address": { "type": "string" },
        "city": { "type": "string" },
        "state": { "$ref": "#/definitions/state" }
      },
      "required": ["street_address", "city", "state"],

      "definitions": {
        "state": { "enum": ["CA", "NY", "... etc ..."] }
      }
    }
  }
}
```
- The address schema is at the uri "/schemas/address" -> Moved into `$defs` as subschema
  (minimal change: only `$id` is required to have "/schemas/address")
- "#/definitions/state" resolves to 'definitions' in the address schema rather than the root schema


# Open API 3.1.0

## Dialects
```yaml
jsonSchemaDialect: 'https://json-schema.org/draft/2020-12/schema' 
components:
  schemas:
    foo:
      type: object
      properties:
        foo:
          $ref: '#/components/schemas/baz'
      unevaluatedProperties: false
    bar:
      $id: './schemas/bar'
      $schema: 'http://json-schema.org/draft-07/schema#'
      type: object
      properties:
        bar:
          $ref: '#/definitions/number'
      definitions:
        number:
          type: number
    baz:
      type: string

```
- `jsonSchemaDialect`: the default dialect
- '/components/schemas/foo' -> JSON Schema 2020-12
- '/components/schemas/bar' -> JSON Schema draft-07
  `$id` separates & `$schema` specify the version
- Reference between these dialects: (For instance, 'bar' refers 'foo' ↓)
  - Refer as `myapi.openapi.yml#/components/schemas/foo`
  - Set './schemas/foo' as `$id` for 'foo' and refer it.


- The schema to validate an OpenAPI 3.1 document with JSON Schema 2020-12 as the default dialect and JSON Schema draft-07 as an allowed alternative.

```yaml
$schema: 'https://json-schema.org/draft/2020-12/schema'

$ref: 'https://spec.openapis.org/oas/3.1/schema'
properties:
  jsonSchemaDialect:
    const: 'https://json-schema.org/draft/2020-12/schema'
required:
  - jsonSchemaDialect

$defs:
  schema:
    $dynamicAnchor: meta
    properties:
      $schema:
        enum:
          - 'https://json-schema.org/draft/2020-12/schema'
          - 'http://json-schema.org/draft-07/schema#'
    allOf:
      - if:
          properties:
            $schema:
              const: 'https://json-schema.org/draft/2020-12/schema'
        then:
          $ref: 'https://json-schema.org/draft/2020-12/schema'
      - if:
          type: object
          properties:
            $schema:
              const: 'http://json-schema.org/draft-07/schema#'
          required:
            - $id
            - $schema
        then:
          $ref: 'http://json-schema.org/draft-07/schema'
```

## Spec
### fields
openapi: 'version'
info: Info Object
jsonSchemaDialect: 'schema uri'
servers: [Server Object]
path: { "/{path}": Path Item Object } (Path Templating Matching '/pets/{petId}')
webhooks: Map[string, Path Item Object | Reference Object] ]
components: Components Object (like `$defs` of JSON Schema)
security: [Security Requirement Object]
tags: [Tag Object]
externalDocs: [External Documentation Object]

- Info Object
title
summary
description
termsOfService: url to Terms of Sservice
contact: name, url, email
lisence: name, identifier, url
version

- Server Object
url: host url. brackets surrounded variable {variable} will be substituted.
description
variables: Map[string, Server Variable Object]
  - Sesrver Variable Object
    enum: [string]
    default
    description

- Components Object
(All of these keys must match `^[a-zA-Z0-9\.\-_]+$`)
schemas: Map[strfing, Schema Object]
responses: .. Response Object | Reference Object
parameters ..
examples ..
requestBodies ..
headers ..
securitySchemes ..
links ..
callbacks ..
pathItems ..

- Path Item Object
$ref: reference to Path Item Object
summary
description
get, put, post, delete, options, head, patch, trace: Operation Object
server: [Server Object]
parameters: [Parameter Object | Reference Object(link to components/parameters)]

- Operation Object
tags
summary
description
externalDocs: External Documentation Object
operationId: unique among all operations
parameters: [Parameter Objectg | Reference Object] Overrides parent's 'parameters'
requestBody: Request Body Object | Reference Object (Avoid in GET, HEAD, DELETE)
responses: Responses Object
callbacks: Map[string | Callback Object | Reference Object]
deprecated: boolean
security: [Security Requirement Object]
servers: [Server Object] Overrides ascendant's 'servers'

- External Documentation Object
description
url

- Parameter Object
name: depends on 'in'. case sensitive
in:
  'path' -> 'name' must correspond to a path template in 'path' of Paths Object
            the path parameter is 'itemId' in '/items/{itemId}'
  'header' -> 'name' is 'Accept', 'Content-Type' or 'Authorization'
            ^header names are case insensitive
  'query' -> the query parameter in the url.
            'name' corrensponds to the parameter name used by the 'id' property.
  'cookie' -> used to pass a cookie value to the API
            'name' corrensponds to the parameter name used by the 'id' property.
description
required: Specify as true if parameter location(the 'in' property) is 'path'
deperecated
- Rules for serialization of the parameter
style: how the parameter value will be serialized. depends on parameter location.
       Default: query -> form, path -> simple, header -> simple, cookie -> form.
       style values https://spec.openapis.org/oas/latest.html#style-examples
explode: boolean. If true, parameter values of type array or object generate separate parameters for each value of the array or key-value pair of the map
allowReserved: boolean whether `:/?#[]@!$&'()*+,;=` are allowed in the parameter. For 'query' parameter location.
schema: Schema Object
example: Example of the parameter’s potential value
examples: Map[string, Example Object | Reference Object] Same as above
content: Map[string, Media Type Object]
(must contain either 'schema' or 'content' not both)

- Request Body Object
description
content: Map[string, Media Type Object] key is media type or media type range
         'text/plain'(most specific) overrides 'text/*'
required

- Media Type Object
schema: Schema Object
example:
examples: Map[string, Example Object | Reference Object]
encoding: Map[string, Encoding Object] https://spec.openapis.org/oas/latest.html#considerations-for-file-uploads

- Encoding Object
contentType, headers, style, explode, allowReserved

- Responses Object
(key): 'default', '(http status code)'
(value): Response Object | Reference Object

- Response Object
description
headers
content
links: Map[string, Link Object | Reference Object]

- Callback Object
{runtime expression}: Path Item Object | Reference Object

- Example Object
summary, description, value: any, externalValue

- Link Object
operationRef: uri reference to an  OAS operation. Must point to (Operation Object)
operationId: name of an existing  resolvable OAS operation
paramters: Map[string, Any | {runtime expression}]
requestBody: Any(a literal value) | {runtime expression} to use as request body
description
server

- Runtime expression https://spec.openapis.org/oas/latest.html#runtimeExpression

- Header Object
Parameter Object without 'name', 'in'  (location paramter is derived from 'header')

- Tag Object
name, description, externalDocs

- Reference Object
$ref, summary, description

- Schema Object
discriminator: Discriminator Object
xml: XML Object
externalDocs

- Descriminator Object (use with 'oneOf', 'anyOf', 'allOf')
propertyName
mapping: Map[string, string] (A mapping payload values and schema names or references)

- XML Object
name, namespace, prefix, attribute, wrapped

- Security Schema Object
type:  'apiKey', 'http', 'mutualTLS', 'oauth2', 'openIdConnect'
description
name
in: 'query', 'header', 'cookie'
scheme
bearerFormat
flows: OAuth Flows Object
openIdConnectUrl

- OAuth Flows Object
implicit, password, clientCredentials, authorizationCode : OAuthFlowObject
  - OAuthFlowObject
  authorizationUrl
  tokenUri
  refreshhUrl
  scopes

- Security Requirement Object
(key): {name} corresponds to a security scheme in (Security Schemesunder the Components Object)
(value): [string]

