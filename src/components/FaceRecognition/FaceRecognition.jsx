import './FaceRecognition.css';

export const FaceRecognition = ({ imageUrl, box }) => {
    return (
        <div className='center ma'>
            <div className="absolute mt2">
                <img id='inputimage'
                    src={imageUrl}
                    alt="Not Found!"
                    width={600}
                    height={'auto'}
                />
                <div className='bounding-box'
                    style={{
                        top: box.topRow,
                        right: box.rightCol,
                        bottom: box.bottomRow,
                        left: box.leftCol
                    }}>
                </div>
            </div>

        </div>

    );
}

// https://cdna.artstation.com/p/assets/images/images/067/669/592/large/blu1304-rey-045.jpg?1695918402
