// from tutorial at https://www.telerik.com/blogs/adding-audio-visualization-react-app-using-web-audio-api

'use client';
import { useRef, useState } from 'react';

let animationController;

export default function Module1() {
  const [file, setFile] = useState(null); // holds the audio file
  const canvasRef = useRef();
  const audioRef = useRef();
  const source = useRef();
  const analyzer = useRef(); // the analyzer node

  const handleAudioPlay = () => {
    let audioContext = new AudioContext(); // create an instance of the AudioContext() class
    if (!source.current) {
      source.current = audioContext.createMediaElementSource(audioRef.current); // create source node and store it in source ref. Receives <audio> element as its parameter.
      analyzer.current = audioContext.createAnalyser(); // create analyzer node using the createAnalyzer method on the audioContext
      source.current.connect(analyzer.current); // connect the source node to the analyzer
      analyzer.current.connect(audioContext.destination); // connect the analyzer node to the speakers/destination node
    }
    visualizeData();
  };

  const visualizeData = () => {
    animationController = window.requestAnimationFrame(visualizeData); // invoke the function provided by the browser—requestAnimationFrame to inform it that we want to perform an animation. Feed it visualizeData as a parameter.
    //  returns the id used internally to identify the visualizeData function in its list of callbacks. This is what we store in the animationController variable we created earlier

    if (audioRef.current.paused) {
      // check if the audio file is still playing
      return cancelAnimationFrame(animationController); // if not, call the cancelAnimationFrame function and pass the id of the visualizeData function
    }
    const songData = new Uint8Array(140); // create a typed array of size 140 and store it in a variable called songData. Each entry in this array is an unsigned integer having a max size of 8 bits (1 byte). We use 140 for the size of our Uint8 array because we only need 140 data points from our audio file in our app.
    analyzer.current.getByteFrequencyData(songData); //  to fill our typed array with the audio data on the analyzer node, we invoke one of its methods—getByteFrequencyData, and pass the typed array to it as its parameter. Internally based on the playback state of the audio file, getByteFrequency extracts frequency domain data from the audio file’s time domain data, a process known as Fast Fourier transform. Based on this, it fills our typed array with only 140 data points from the extracted audio data.
    const bar_width = 3; // the width of each rectangle
    let start = 0; // start variable represents the x-coordinate on the canvas which will be computed to draw a single rectangle
    const ctx = canvasRef.current.getContext('2d'); // prepare our canvas context for 2d rendering
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // using the clearRect() method, we clear the contents of the canvas to get rid of previous visuals
    for (let i = 0; i < songData.length; i++) {
      start = i * 8; // compute the x-coordinate where we want to draw the rectangle and store it in the start variable
      const scaledHeight = (songData[i] / 255) * canvasRef.current.height; // getByteFrequencyData() returns values in the range 0-255. Scale the data to fit the canvas height. Dividing by 255 normalizes it to 0-1. Multiplying by canvasHeight scales it to your canvas size.
      let gradient = ctx.createLinearGradient(
        // create a linear gradient that spans the entire canvas and store it in the gradient variable
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );
      gradient.addColorStop(0.2, '#2392f5'); // add three color stops to the gradient using the addColorStop method
      gradient.addColorStop(0.5, '#fe0095');
      gradient.addColorStop(1.0, 'purple');
      ctx.fillStyle = gradient; // set the gradient as the fillStyle on the canvas context
      ctx.fillRect(start, canvasRef.current.height, bar_width, -scaledHeight); // draw the rectangle on the screen
      // PARAMETERS:
      // The computed x coordinate to draw the rectangle.
      // The y coordinate, which is the height of the canvas.
      // The width of the rectangle, which is the bar_width we defined earlier.
      // Use scaled height. Now the tallest bars will reach the full canvas height. The negative value draws upward from the bottom.
    }
  };

  return (
    <div className="w-fit mx-auto mt-30">
      <h2 className="">module 1</h2>
      <div className="">
        <div className="flex gap-5">
          <label className="">Upload an audio file:</label>
          <input
            type="file"
            id="fileInput"
            onChange={({ target: { files } }) => files[0] && setFile(files[0])}
          />
        </div>
        {file && (
          <audio
            ref={audioRef}
            onPlay={handleAudioPlay}
            src={window.URL.createObjectURL(file)}
            controls
            className="my-5"
          />
        )}
        <canvas
          ref={canvasRef}
          width={1000}
          height={700}
          className="border-1 mt-10"
        />
      </div>
    </div>
  );
}
