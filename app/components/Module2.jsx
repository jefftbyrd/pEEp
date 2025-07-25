// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API

'use client';
import { useRef, useState } from 'react';

let animationController;

export default function Module2() {
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
    // const dataArray = new Uint8Array(bufferLength);

    animationController = window.requestAnimationFrame(visualizeData);

    if (audioRef.current.paused) {
      // check if the audio file is still playing
      return cancelAnimationFrame(animationController); // if not, call the cancelAnimationFrame function and pass the id of the visualizeData function
    }
    analyzer.current.fftSize = 2048;
    const bufferLength = analyzer.current.frequencyBinCount;
    const songData = new Uint8Array(bufferLength);
    analyzer.current.getByteTimeDomainData(songData);
    // const bar_width = 3; // the width of each rectangle
    let start = 0;
    const ctx = canvasRef.current.getContext('2d'); // prepare our canvas context for 2d rendering
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillStyle = 'rgb(0 0 0)';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Begin the path
    ctx.lineWidth = 2;
    // ctx.strokeStyle = 'rgb(255 255 255)';
    ctx.beginPath();
    // Draw each point in the waveform
    const sliceWidth = canvasRef.current.width / bufferLength;
    let x = 0; // Initialize x variable
    for (let i = 0; i < bufferLength; i++) {
      // const scaledHeight = (songData[i] / 255) * canvasRef.current.height;
      const v = songData[i] / 128.0;
      const y = v * (canvasRef.current.height / 2);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
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
      ctx.strokeStyle = gradient;
    }
    ctx.lineTo(canvasRef.current.width, canvasRef.current.height / 2);
    ctx.stroke();
  };

  return (
    <div className="w-full mt-30">
      <div className="mb-10">
        <h2 className="">module 2</h2>
        <h3>Oscilloscope</h3>
      </div>
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
          height={500}
          className="border-1 mt-10"
        />
      </div>
    </div>
  );
}
