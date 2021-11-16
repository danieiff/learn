Upload photo to server

We will create a service for upload image to the server.

Server#

Let's create our service first.

Create a file in /server folder, let's name it file-upload.tsx

/server/file-upload.tsx

import * as vtecxapi from 'vtecxapi'

interface Param {
  image: string // it has to match with the 'name' of the field in client side
  // so in client side field name should be 'image' i.e. <Input type="file" name="image" >
}

const image: Param = {
  image: vtecxapi.getQueryString('key') // query param 'key' where we will send the image path and name from client
}

vtecxapi.saveFiles(image)

Copy
You can see how simple the file-upload.tsx is.

Just get the image key from the query param.

const image: Param = {
  image: vtecxapi.getQueryString('key')
}
Copy
Then upload image using API vtecxapi.saveFiles()

vtecxapi.saveFiles(image)
Copy
Multiple keys#

You can upload multiple images this way. Just add the key in image object. Another point to remember

client side file name should match with param object keys i.e image1, image2, image3.
Parameter key and Input field name


### Client

Let's create our uploadImageForm component.

```javascript
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import axios, { AxiosError } from 'axios'

/* コンポーネントのPropsの型宣言 */
interface ComponentProps {
}
/* コンポーネントのStateの型宣言 */
interface ComponentState {
    image1: any,
    image2: any,
    [propName: string]: any
}

class UploadImageForm extends React.Component<ComponentProps, ComponentState> {
    constructor(props: ComponentProps) {
        super(props)
        this.state = { image1: {}, image2: {} }
    }

    handleChange(e: React.FormEvent<any>) {
      // do something
    }

    handleSubmit(e: React.FormEvent<any>) {
        e.preventDefault()
       // do something
    }

    render() {
        return (
            <form onSubmit={(e) => this.handleSubmit(e)}>
                <img src={this.state.image1.value} />
                <br />
                <img src={this.state.image2.value} />
                <br />
                <div>
                    <input type="file" name="image1" onChange={(e) => handleChange(e)} />
                </div>
                <div>
                    <input type="file" name="image2" onChange={(e) => handleChange(e)} />
                </div>
                <div>
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                </div>
            </form>
        )
    }
}

ReactDOM.render(<UploadImageForm />, document.getElementById('container'))
Copy
We've created a normal html form with React. onChange handler attach to file input field and onSubmit event for handling form submition.

Now handle onChnage event.#

    handleChange(e: React.FormEvent<any>) {
        if (e.currentTarget.files) {
            const file = e.currentTarget.files.item(0) // get the file from current file input

            if (file) {
                const key = '/_html/img/' + encodeURIComponent(file.name) // you can use an arbitrary name instead of file.name
                const name = e.currentTarget.name

                // 画像以外は処理を停止
                // return if not type of file is image
                if (!file.type.match('image.*')) {
                    return
                } else {
                    // 画像表示
                    // display image
                    let reader = new FileReader()
                    reader.onload = () => {
                        this.setState({ [name]: { value: reader.result, key: key } })
                    }
                    //to preview
                    reader.readAsDataURL(file)
                }
            }
        }
    }
Copy
What we did in handleChange is, first we get the file from target input field. Then we check if file if (file) exists. If file exist we create a key

const key = '/_html/img/' + encodeURIComponent(file.name)
Copy
/_html/img/ is the server address, in which the file will uploaded. We are creating a key with the the path of the uploaded file. And you can use an arbitrary name instead of file.name as filename

Next we're checking if the file type is 'image'. If file type not image then return.

Next we use the FileReader object which lets us asynchronously read the contents of files (or raw data buffers) stored on the user's computer, using File or Blob objects to specify the file or data to read. For more Details FileReader

Next in FileReader.onload event we update the state of image with result. FileReader.onload is a handler for the load event. This event is triggered each time the reading operation is successfully completed. We store the key as well in state image object.

To preview selected image we use readAsDataURL method. It is used to read the contents of the specified Blob or File.

Now handle the submit event.#

We need to organize param. Where we will send image object key value as param. The image will be saved in the server as /d/_html/img/{file name}.

Next we will send a POST request. We will use Axios for HTTP request handling. Our url would be /s then service file name in the ./server folder i.e in our case /s/file-upload?.

Full url format

`/s/file-upload?key1=/_html/img/{filename}&key2=/_html/img/{filename}&key3=/_html/img/{filename}...`
Copy
In server we will get the keys from query param as describe here

We will pass formData as data value in axios.


    handleSubmit(e: React.FormEvent<any>) {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const param = (this.state.image1.key ? 'key1=' + this.state.image1.key + '&' : '') +
            (this.state.image2.key ? 'key2=' + this.state.image2.key : '')

        // 画像は、/d/_html/img/{file name}  としてサーバに保存されます
        // The image will be saved in the server as /d/_html/img/{file name}
        axios({
            url: '/s/file-upload?' + param,
            method: 'post',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            data: formData

        }).then(() => {
            alert('success')
        }).catch((error: AxiosError) => {
            if (error.response) {
                alert('error=' + JSON.stringify(error.response))
            } else {
                alert('error')
            }
        })

    }
Copy
That's it, both client and server functionality is done. So whenever we submit form with image file our BFF(Backend for Frontend) service i.e file-upload.tsx file will upload those image to server using vtecxapi.saveFiles().

That is how vtecxapi made our life easier.

Delete photo from server

So how can we delete an image from server?

Just send a DELETE request to the server with image URL endpoint.

axios.delete('/d/img/example.png')
Copy
As you see we can only delete single image this way.

To delete multiple image files we need to arranged an object array with ?_delete key.
const images = [
    {
      id: '?_delete',
      link: [
        {
          ___href: '/_html/img/sample_1.png',
          ___rel: 'self'
        }
      ]
    },
    {
      id: '?_delete',
      link: [
        {
          ___href: '/_html/img/sample_2.png',
          ___rel: 'self'
        }
      ]
    }
  ]
  then
  const deleteImages = async () => {
    await commonAxios(states, '/d', 'put', images)
}