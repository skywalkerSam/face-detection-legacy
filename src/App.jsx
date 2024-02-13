/*
Dev: @skywalkerSam
Purpose: face-detection project
Stardate: 12024.01.30.0137
*/
/*
TODOs:
- Error handling!
- Frontend Validation
- Backend Validation - DONE!
- Move API calls to backend for security purposes - DONE!
- Server setup n' integration    ( Cloud )

There's always some room for improvement, isn't it? 
- Make components smaller and more reusable! ( DRY )
*/

import { Component } from "react";
import './App.css';
import ParticlesBg from "particles-bg";
import { Logo } from "./components/Logo/Logo";
import { Navigation } from "./components/Navigation/Navigation";
import { ImageLinkForm } from "./components/ImageLinkForm/ImageLinkForm";
import { Rank } from "./components/Rank/Rank";
import { FaceRecognition } from "./components/FaceRecognition/FaceRecognition";
import { SignIn } from "./components/SignIn/SignIn";
import { Register } from "./components/Register/Register";

// const PAT = '';
// const USER_ID = '';
// const APP_ID = 'face-detection';
// const MODEL_ID = 'face-detection';
// const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';

const initialState = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'sign-in',
    isSignedIn: false,
    user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: '',
    }
}

export default class App extends Component {
    constructor() {
        super();
        this.state = initialState;
    }

    loadUser = (data) => {
        this.setState({
            user: {
                id: data.id,
                name: data.name,
                email: data.email,
                entries: data.entries,
                joined: data.joined
            }
        })
    }

    // componentDidMount() {
    //     fetch('http://localhost:3333/')
    //         .then(response => response.json())
    //         .then(console.log)
    // }

    onRouteChange = (route) => {
        (route === 'sign-out') ? this.setState(initialState)
            : this.setState({ route: route })
    }

    calculateFaceLocation = (data) => {
        // console.log('Clarifai Model Response:', data);
        const clarifaiFaceDetect = data.data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputimage');
        const imageWidth = Number(image.width);
        const imageHeight = Number(image.height);
        // console.log(clarifaiFaceDetect, imageWidth, imageHeight)
        return {
            topRow: clarifaiFaceDetect.top_row * imageHeight,
            leftCol: clarifaiFaceDetect.left_col * imageWidth,
            rightCol: imageWidth - (clarifaiFaceDetect.right_col * imageWidth),
            bottomRow: imageHeight - (clarifaiFaceDetect.bottom_row * imageHeight)
        }
    }

    displayFaceBox = (box) => {
        this.setState({ box: box })
    }

    onInputChange = (event) => {
        this.setState({ input: event.target.value })
        console.log('Image URL:', event.target.value);
    }

    onPictureSubmit = () => {
        this.setState({ imageUrl: this.state.input })
        // const IMAGE_URL = this.state.input;

        fetch('https://face-detection-backend-one.onrender.com/imageurl', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                input: this.state.input
            })
        })
            .then(response => response.json())
            .then(result => this.displayFaceBox(this.calculateFaceLocation(result)))
            .catch(err => console.log(err))

        console.log('Fetching the Image... ')

        fetch('https://face-detection-backend-one.onrender.com/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: this.state.user.id
            })
        })
            .then(response => response.json())
            .then(count => {
                // Object.assign doesn't creates a new object, it references to the original object!
                this.setState(Object.assign(this.state.user, { entries: count }))
            })
            .catch(err => console.log(err))

        // const raw = JSON.stringify({
        //     "user_app_id": {
        //         "user_id": USER_ID,
        //         "app_id": APP_ID
        //     },
        //     "inputs": [
        //         {
        //             "data": {
        //                 "image": {
        //                     "url": IMAGE_URL
        //                 }
        //             }
        //         }
        //     ]
        // });

        // const requestOptions = {
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Authorization': 'Key ' + PAT
        //     },
        //     body: raw
        // };

        // fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
        //     .then(response => response.json())
        //     .then(result => this.displayFaceBox(this.calculateFaceLocation(result)))

        // .catch(error => console.log('Error Occoured: ', error));
    }

    render() {
        const { imageUrl, box, route, isSignedIn } = this.state;
        return (
            <div className="App">
                <h1 className="red f3">Under Development!</h1>
                <ParticlesBg type="lines" num={3} bg={true} />
                <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}></Navigation>
                <Logo onRouteChange={this.onRouteChange}></Logo>
                {(route === 'face-detect') ?
                    <div>
                        <Rank name={this.state.user.name} entries={this.state.user.entries}></Rank>
                        <ImageLinkForm
                            onInputChange={this.onInputChange}
                            onPictureSubmit={this.onPictureSubmit}>
                        </ImageLinkForm>
                        <FaceRecognition imageUrl={imageUrl} box={box}></FaceRecognition>
                    </div>
                    : (route === 'sign-in') ?
                        <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser}></SignIn>
                        : (route === 'sign-up') ?
                            <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}></Register>
                            : console.log('Routing Error Occoured...!')
                }
            </div>
        )
    }
}



/* 
Sample Images URLs:

    https://samples.clarifai.com/metro-north.jpg

    https://cdnb.artstation.com/p/assets/images/images/072/485/995/4k/chengwei-pan-1.jpg?1707463211

    https://cdna.artstation.com/p/assets/images/images/072/167/834/large/eunice-ye-.jpg?1706752364

    https://cdna.artstation.com/p/assets/images/images/072/178/120/large/alex-gray-tbrender-camera-38.jpg?1706781629

    https://cdnb.artstation.com/p/assets/images/images/072/184/959/4k/hwng-edric-nguyen-tbrender-viewport-009.jpg?1706793715

*/
