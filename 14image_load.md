Upload Photo
Uploading photo takes little bit of understanding of the parameters. As you can see, you can send multiple images using vtecxapi very easily. There is some setup that we need to go through to upload the image. First we need to defined in our server side file src/server/save-profile-photo what parameter we would be sending from the client side. In the example below, we are using

profile_photo

In this profile_photo param we have send an query string which is

/_html/img/profile_photo

This value indicates where the file should be location and it also allows the user to call the server side and ask for the image

<link href="/d/_html/img/profile_photo">

/d/_html will be rewritten to /. So it can be omitted.

<link href=“/img/profile_photo”>

In this way calling image using tags becomes very flexible and allows us to write clean code.

You can save it anywhere in custom locations but before you go and save in there we need to go through User, group management and access control which we will go through it later

Rule of thumb should be

[your-variable-string]: '/d/_html/img/[your-file-name]'

"import * as vtecxapi from 'vtecxapi'\n\ninterface Param {\n    profile_photo: string\n}\n\nconst param: Param = {\n    profile_photo: vtecxapi.getQueryString('profile_photo')\n}\n\nvtecxapi.saveFiles(param)"
#### Delete Photo
To delete an image you need to send a delete request with image URL endpoint
"await axios.delete('/d/img/sample-[user-id-or-alloc-id-or-uid].jpg')"
Delete photo from anywhere
"await axios.delete('/d/_html/img/sample.jpg')"
Delete photo from anywhere
"await axios.delete('/d/_html/img/sample.jpg)"
Delete photo from anywhere
"\nconst request = [\n    {\n      id: '?_delete',\n      link: [\n        {\n          ___href: '/_html/img/sample-1.png',\n          ___rel: 'self'\n        }\n      ]\n    },\n    {\n      id: '?_delete',\n      link: [\n        {\n          ___href: '/_html/img/sample-2.png',\n          ___rel: 'self'\n        }\n      ]\n    },\n]\n\naxios.put('d', request)"
Delete multiple photo from anywhere
### Send Email
```
"import * as vtecxapi from 'vtecxapi'\n\nconst mailentry = {\n    'entry': {\n        'title': 'Sendmail test',\n        'summary': 'hello text mail',\n        'content': {\n            '______text': 'hello html mail '\n        }\n    }\n}\n\n\nconst to = [\"john.doe@gmaill.com\"];\nconst cc = [\"john.doe@gmail.com\"];\nconst bcc = [\"john.doe@gmail.com\"];\nconst attachments = [\"/_html/img/vtec_logo.png\"];\n\nvtecxapi.sendMail(mailentry, to, cc, bcc, attachments);\nvtecxapi.doResponse({})\n"
```

### BQ
"import * as vtecxapi from 'vtecxapi'\n\nconst offset = vtecxapi.getQueryString(\"offset\");\nconst limit = vtecxapi.getQueryString(\"limit\")\nconst search = vtecxapi.getQueryString(\"search\")\nconst yoga = vtecxapi.getQueryString(\"yoga\")\n\nlet sql =\n    \"SELECT f.key, name, japanese_name, email, gender, company_name, job_title, age, country, yoga, description, k.updated  FROM photon_business_test.user AS f\" +\n    \" RIGHT JOIN (SELECT key, max(updated) AS updated FROM photon_business_test.user GROUP BY key) as k\" +\n    \" ON f.updated = k.updated AND f.key = k.key WHERE f.deleted = FALSE\"\n\nif (search) {\n    sql += ` AND (REGEXP_CONTAINS(name, r'${search}') OR REGEXP_CONTAINS(email, r'${search}') OR REGEXP_CONTAINS(description, r'${search}'))`;\n}\n\nif (yoga) {\n    sql += ` AND (REGEXP_CONTAINS(yoga, r'${yoga}')`;\n}\n\nif (offset !== null && offset !== undefined && limit !== null && limit !== undefined) {\n    sql += ` LIMIT ${limit} OFFSET ${offset}`;\n}\n\nconst result: VtecxApp.Entry[] = vtecxapi.getBQ(sql);\nvtecxapi.log(\"GET USER BIG QUERY ::::\", JSON.stringify(result));\n\nconst modifyResult = result.map((perResult) => {\n    const { key, updated, deleted, ...requiredData }: any = perResult\n\n    return {\n        user: {\n            ...requiredData\n        },\n        updated,\n        link: [\n            {\n                ___href: key,\n                ___rel: \"self\"\n            }\n        ]\n    };\n})\n\nvtecxapi.doResponse(modifyResult, 200)\n"

"import * as vtecxapi from \"vtecxapi\";\nimport get from 'lodash/get'\n\nconst clientData = vtecxapi.getRequest()\nif (Array.isArray(clientData) && clientData.length > 0) {\n    const UUID = vtecxapi.addids(\"/users\", 1);\n    const firstClientData = clientData[0]\n    const user = get(firstClientData, 'user', {})\n\n    const requestData = {\n        feed: {\n            entry: [\n                {\n                    user,\n                    link: [{\n                        ___rel: \"self\",\n                        ___href: `/users/${UUID}`\n                    }]\n                }\n            ]\n        }\n    };\n\n    try {\n        vtecxapi.log(\"POST USER BIG QUERY ::::\", JSON.stringify(requestData))\n        vtecxapi.postBQ(requestData, false);\n\n        vtecxapi.log(\"POST USER DATABASE::::\", JSON.stringify(requestData))\n        vtecxapi.post(requestData, \"/users\");\n\n        vtecxapi.log(\"POST USER DATA ::::\", JSON.stringify(requestData))\n        vtecxapi.doResponse(requestData)\n    } catch(error) {\n        vtecxapi.sendError(400, error)\n    }\n} else {\n    vtecxapi.log(\"POST USER DATA STRUCTURE NOT CORRECT::::\", \"Please fix the shape of the object of user\");\n    vtecxapi.sendError(400, \"POST_USER_DATA_STRUCTURE_NOT_CORRECT\");\n}"

"import * as vtecxapi from \"vtecxapi\";\nimport get from 'lodash/get'\n\nconst clientData = vtecxapi.getRequest()\nif (Array.isArray(clientData) && clientData.length > 0) {\n    const firstClientData = clientData[0]\n    const user = get(firstClientData, 'user', {})\n    const link = get(firstClientData, 'link', [])\n\n    const requestData = {\n        feed: {\n            entry: [\n                {\n                    user,\n                    link\n                }\n            ]\n        }\n    };\n\n    try {\n        vtecxapi.log(\"POST USER BIG QUERY ::::\", JSON.stringify(requestData))\n        vtecxapi.postBQ(requestData, false);\n\n        vtecxapi.log(\"POST USER DATABASE::::\", JSON.stringify(requestData))\n        vtecxapi.put(requestData);\n\n        vtecxapi.log(\"POST USER DATA ::::\", JSON.stringify(requestData))\n        vtecxapi.doResponse(requestData)\n    } catch(error) {\n        vtecxapi.sendError(400, error)\n    }\n} else {\n    vtecxapi.log(\"POST USER DATA STRUCTURE NOT CORRECT::::\", \"Please fix the shape of the object of user\");\n    vtecxapi.sendError(400, \"POST_USER_DATA_STRUCTURE_NOT_CORRECT\");\n}\n"

"import * as vtecxapi from 'vtecxapi'\nimport get from 'lodash/get'\n\n\nconst clientData = vtecxapi.getRequest();\nif (Array.isArray(clientData) && clientData.length > 0) {\n    const firstClientData = clientData[0];\n    const linkData = get(firstClientData, \"link\", []);\n    const firstLinkData = linkData[0];\n    const ID = get(firstLinkData, \"___href\", \"\").replace(/ /g, \"\");\n    const hasUserData = vtecxapi.getEntry(ID);\n\n    if (hasUserData) {\n        try {\n            vtecxapi.log(\"DELETE USER ID ::::\", ID);\n            vtecxapi.deleteEntry(ID)\n            vtecxapi.log(\"DELETE USER DATABASE ::::\", 'Deleted Entry');\n            vtecxapi.deleteBQ([ID], false, { users: \"users\" });\n            vtecxapi.log(\"DELETE BIQ QUERY USER ::::\", JSON.stringify(hasUserData));\n        } catch (error) {\n            vtecxapi.sendError(400, error);\n        }\n    } else {\n        vtecxapi.log(\"DELETE USER DO NOT EXIT ::::\", \"User do not exist\");\n        vtecxapi.sendError(400, \"USER_DO_NOT_EXIST\");\n    }\n}\n"

"\nimport * as vtecxapi from \"vtecxapi\";\n\nconst type = vtecxapi.getQueryString(\"type\");\n\nexport const SELECT_ALL =\n  \"WITH sub_query as ( \" +\n  \"SELECT everything.key, name, japanese_name, email, gender, company_name, job_title, age, country, yoga, description FROM photon_business_test.user AS everything \" +\n  \"RIGHT JOIN \" +\n  \"(SELECT key, MAX(updated) as updated FROM photon_business_test.user GROUP BY key) AS recent \" +\n  \"ON everything.key = recent.key AND everything.updated = recent.updated \" +\n  \"WHERE everything.deleted = FALSE\" +\n  \") \";\n\nlet yoga_gender =\n  SELECT_ALL +\n  \"SELECT gender, CAST(COUNT(case WHEN yoga='true' then 1 end) AS STRING) AS yoga_yes, \" +\n  \"CAST(COUNT(case WHEN yoga='false' then 1 end) AS STRING) AS yoga_no, \" +\n  \"CAST(COUNT(*) AS STRING) as total  FROM sub_query GROUP BY gender \";\n\nlet yoga_country =\n  SELECT_ALL +\n  \"SELECT yoga, CAST(COUNT(CASE WHEN country='United States' THEN 1 END) AS STRING) as united_states, \" +\n  \"CAST(COUNT(CASE WHEN country='Bangladesh' THEN 1 END) AS STRING) as bangladesh, \" +\n  \"CAST(COUNT( CASE WHEN COUNTRY='Japan' THEN 1 END) AS STRING) as japan FROM sub_query GROUP BY yoga\";\n\nlet yoga_age =\n  SELECT_ALL +\n  \"SELECT yoga, \" +\n  \"CAST(COUNT(CASE WHEN CAST(age as INT64) >= 5 and CAST(age as INT64) = 21 and CAST(age as INT64) = 31 and CAST(age as INT64) = 41 and CAST(age as INT64) = 51 and CAST(age as INT64) = 5 AND CAST(age as INT64) = 21 AND CAST(age as INT64) = 31 AND CAST(age as INT64) = 41 AND CAST(age as INT64) = 51 AND CAST(age as INT64)  {\n    return {\n      result: {\n        ...perResult\n      }\n    };\n  });\n\n  vtecxapi.doResponse(modifyResult, 200);\n} else {\n  vtecxapi.sendError(400);\n}\n"