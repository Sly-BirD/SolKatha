import React, { useRef, useEffect, useState } from 'react';
import { auth, db, uploadCanvasImage, listUserSketches } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function KrishnaInteractionPanel() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 300;
    canvas.height = 200;
    const _ctx = canvas.getContext('2d');
    _ctx.fillStyle = 'rgba(255,255,255,0.03)';
    _ctx.fillRect(0,0,canvas.width, canvas.height);
    setCtx(_ctx);
  }, []);

  const [savedUrls, setSavedUrls] = useState([]);

  useEffect(() => {
    // load user sketches if available
    const load = async () => {
      try {
        const uid = auth.currentUser?.uid || 'anon';
        const urls = await listUserSketches(uid);
        setSavedUrls(urls);
      } catch (e) {
        console.error('Failed to list sketches', e);
      }
    };
    load();
  }, []);

  const start = (e) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };
  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    ctx.lineTo(offsetX, offsetY);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.stroke();
  };
  const end = () => setIsDrawing(false);

  const saveCanvas = async () => {
    try {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/png');
      const uid = auth.currentUser?.uid || 'anon';
      const filename = `sketch-${Date.now()}.png`;
      const url = await uploadCanvasImage(uid, filename, dataUrl);
      setSavedUrls((s) => [url, ...s]);
      alert('Sketch saved');
    } catch (e) {
      console.error('Save failed', e);
      alert('Save failed');
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const _ctx = ctx;
    if (!_ctx) return;
    _ctx.clearRect(0,0,canvas.width, canvas.height);
    _ctx.fillStyle = 'rgba(255,255,255,0.03)';
    _ctx.fillRect(0,0,canvas.width, canvas.height);
  };

  const handleVoiceCapture = async () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech Recognition not supported in this browser');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onresult = async (evt) => {
      const text = evt.results[0][0].transcript;
      setMessage(text);
      try {
        await addDoc(collection(db, 'messages'), {
          role: 'user',
          content: text,
          userId: auth.currentUser?.uid || 'anon',
          timestamp: new Date(),
        });
      } catch (e) {
        console.error('Failed to add voice message', e);
      }
    };
    recognition.start();
  };

  // Simple Web Audio example: play a calming oscillator tone
  const playTone = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.value = 432; // calming frequency
      g.gain.value = 0.02;
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start();
      // visualizer setup
      const analyser = audioCtx.createAnalyser();
      g.connect(analyser);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const visCanvas = document.getElementById('audio-vis');
      if (visCanvas) {
        const vCtx = visCanvas.getContext('2d');
        const draw = () => {
          if (!visCanvas) return;
          analyser.getByteFrequencyData(dataArray);
          vCtx.fillStyle = 'rgba(0,0,0,0)';
          vCtx.clearRect(0,0,visCanvas.width, visCanvas.height);
          const barWidth = (visCanvas.width / bufferLength) * 1.5;
          let x = 0;
          for (let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i] / 2;
            vCtx.fillStyle = '#FFD700';
            vCtx.fillRect(x, visCanvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
          }
        };
        const id = setInterval(draw, 60);
        setTimeout(() => { clearInterval(id); o.stop(); }, 2000);
      } else {
        setTimeout(() => o.stop(), 2000);
      }
    } catch (err) {
      console.error('Audio play failed', err);
    }
  };

  return (
    <div className="bg-white/5 rounded-xl p-4 text-white">
      <h3 className="font-bold text-lg mb-2">Krishna Interaction</h3>
      <p className="text-sm text-white/80 mb-2">Short story: Krishna offers a reflective prompt to begin your session.</p>
      <div className="mb-3">
        <button onClick={handleVoiceCapture} className="px-3 py-1 bg-teal-500 rounded">Speak</button>
        <button onClick={playTone} className="ml-2 px-3 py-1 bg-gold-200 text-purple-900 rounded">Play Tone</button>
      </div>

      <canvas ref={canvasRef} className="w-full h-48 rounded-lg border border-white/5 mb-2 touch-none" onMouseDown={start} onMouseMove={draw} onMouseUp={end} onMouseLeave={end} />

      <div className="flex gap-2 mb-2">
        <button onClick={saveCanvas} className="px-3 py-1 bg-teal-500 rounded">Save Sketch</button>
        <button onClick={clearCanvas} className="px-3 py-1 bg-white/10 rounded">Clear</button>
      </div>

      <canvas id="audio-vis" width="300" height="60" className="w-full mb-2" />

      <div className="mt-2 text-sm text-white/70">Your voice: {message}</div>

      {savedUrls.length > 0 && (
        <div className="mt-2">
          <h5 className="text-sm font-semibold mb-1">Saved Sketches</h5>
          <div className="space-y-2">
            {savedUrls.map((u, i) => (
              <img src={u} alt={`sketch-${i}`} key={u} className="w-full rounded border border-white/5" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
