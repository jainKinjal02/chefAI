import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import backgroundVideo from '../../assets/kitchen.mp4';
import ChatInterface from './ChatInterface';

// Video background container
const VideoBackgroundContainer = styled.div`
  flex: 1;
  overflow: hidden;
  margin-top: 80px;
  position: relative;
`;

// Video element styling
const BackgroundVideo = styled.video`
  position: fixed;
  top: 0;
  left: 0;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: -2;
  object-fit: cover;
`;

// Dark overlay for better content visibility
const VideoOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: -1;
`;

// Content container
const ContentContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const ChatContainerWithVideo = ({ initialQuery }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <VideoBackgroundContainer>
      <BackgroundVideo
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={backgroundVideo} type="video/mp4" />
      </BackgroundVideo>
      <VideoOverlay />
      <ContentContainer>
        <ChatInterface initialQuery={initialQuery} />
      </ContentContainer>
    </VideoBackgroundContainer>
  );
};

export default ChatContainerWithVideo;