import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import socket from "../Utils/socket";
import { useParams } from "react-router-dom";

export default function VideoCall({ userId }) {
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const pc = useRef(null);

  const [inCall, setInCall] = useState(false);
  const {id} = useParams()

  useEffect(() => {
    // socket.emit("join", userId);

    socket.on("incomingCall", async ({ from, offer }) => {
        console.log("Incoming call ",from ,offer)
      pc.current = createPeerConnection(from);
      await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answer);
      socket.emit("answerCall", { to: from, answer });
    });

    socket.on("callAccepted", async ({ answer }) => {
      await pc.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("iceCandidate", async ({ candidate }) => {
      try {
        await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error("Error adding ICE candidate", e);
      }
    });
  }, []);

  const createPeerConnection = (otherUser) => {
    const peer = new RTCPeerConnection();
    peer.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("iceCandidate", { to: otherUser, candidate: e.candidate });
      }
    };
    peer.ontrack = (e) => {
      remoteVideo.current.srcObject = e.streams[0];
    };

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideo.current.srcObject = stream;
        stream.getTracks().forEach((track) => peer.addTrack(track, stream));
      });

    return peer;
  };

  const startCall = async (calleeId) => {
    console.log("Call this : ",calleeId)
    pc.current = createPeerConnection(calleeId);
    const offer = await pc.current.createOffer();
    await pc.current.setLocalDescription(offer);
    socket.emit("callUser", { to: calleeId, offer });
    setInCall(true);
  };

  return (
    <div className="bg-yellow-200">
      <video ref={localVideo} autoPlay playsInline muted className="w-1/2" />
      <video ref={remoteVideo} autoPlay playsInline className="w-1/2" />

      {!inCall && (
        <button
          onClick={() => startCall(id)}
          className="bg-green-500 text-white px-4 py-2"
        >
          Start Call
        </button>
      )}
    </div>
  );
}
