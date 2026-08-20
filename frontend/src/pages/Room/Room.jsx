import {
  ControlBar,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
} from "@livekit/components-react";
import { Room, Track } from "livekit-client";
import "@livekit/components-styles";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../config/constant";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCall } from "../../Provider/Provider";
import getLiveKitUrl from "../../hooks/users/getLiveKitUrl";
import { PhoneCall, Loader2 } from "lucide-react";

export default function RoomPage() {
  const [token, setToken] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleEndCall } = useCall();
  const [liveKitUrl, setLiveKitUrl] = useState("");

  let roomName = searchParams.get("roomName");
  let username = searchParams.get("username");
  let peerSocketId = searchParams.get("peerSocketId");

  const [room] = useState(
    () =>
      new Room({
        adaptiveStream: true,
        dynacast: true,
      }),
  );

  // Connect to room
  useEffect(() => {
    if (token && liveKitUrl) {
      let mounted = true;
      const connect = async () => {
        if (mounted) {
          await room.connect(liveKitUrl, token);
          room.localParticipant.setMicrophoneEnabled(true);
          // room.localParticipant.setCameraEnabled(true);
        }
      };
      connect();

      room.on("disconnected", () => {
        handleEndCall(peerSocketId);
      });

      return () => {
        mounted = false;
        // room.disconnect();
      };
    }
  }, [room, token, navigate, handleEndCall, peerSocketId, liveKitUrl]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios(
        `${BASE_URL}/liveKit/get-token?roomName=${roomName}&username=${username}`,
      );
      const { token } = data;
      setToken(token);
    };
    fetch();
  }, [roomName, username]);

  useEffect(() => {
    const fetchLiveKitUrl = async () => {
      try {
        const { data } = await getLiveKitUrl();
        if (data.success) {
          setLiveKitUrl(data.data.url);
        }
      } catch (error) {
        console.error("Failed to fetch LiveKit URL:", error);
      }
    };
    fetchLiveKitUrl();
  }, []);

  return (
    <RoomContext.Provider value={room}>
      <div
        data-lk-theme="default"
        style={{ height: "100vh" }}
        className="flex flex-col bg-white">
        {/* Header — mirrors the Drawer's brand bar */}
        <div className="navbar bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center shadow-md">
              <PhoneCall className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base leading-tight">
                The
                <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                  Tarainn
                </span>
              </h2>
              <p className="text-xs text-gray-500">Live Call</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-teal-50 px-3 py-1 text-xs font-medium text-blue-600">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            Connected
          </span>
        </div>

        <MyVideoConference />
        <RoomAudioRenderer />

        {/* Control bar wrapper — same surface language as the Drawer's bottom section */}
        <div className="border-t border-gray-200 bg-white px-4 py-3 shrink-0">
          <ControlBar />
        </div>
      </div>
    </RoomContext.Provider>
  );
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  const localTrack = tracks.find((t) => t.participant.isLocal);
  const remoteTracks = tracks.filter((t) => !t.participant.isLocal);

  return (
    <div className="w-full flex-1 relative bg-gray-900 overflow-hidden">
      {/* Remote participant(s) full screen */}
      <div className="w-full h-full flex items-center justify-center">
        {remoteTracks.length > 0 ? (
          remoteTracks.map((track) => (
            <ParticipantTile
              key={track.participant.identity + track.source}
              trackRef={track}
              className="w-full h-full object-cover"
            />
          ))
        ) : (
          <div className="flex flex-col items-center gap-3 text-white/90">
            <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-teal-400" />
            </div>
            <p className="text-sm font-medium text-white/70">
              Waiting for other user...
            </p>
          </div>
        )}
      </div>

      {/* Local participant small top-right corner — CallBell gradient border */}
      {localTrack && (
        <div className="absolute top-4 right-4 w-40 h-28 rounded-xl overflow-hidden shadow-lg p-[2px] bg-gradient-to-r from-blue-600 to-teal-500">
          <div className="w-full h-full rounded-[10px] overflow-hidden bg-black">
            <ParticipantTile trackRef={localTrack} />
          </div>
        </div>
      )}
    </div>
  );
}
