import * as React from 'react';

export const enum VIDEO_FORMAT_ENUM {
  IFRAME = 'iframe',
  VIDEO = 'video',
}

export default function Video({ src, title, format }) {
  switch (format) {
    case VIDEO_FORMAT_ENUM.VIDEO:
      return (
        <video
          width="100%"
          height="100%"
          autoPlay
          muted
          controls
          loop
          style={{
            objectFit: 'cover',
            objectPosition: 'contain',
            left: 0,
            top: 0,
          }}
        >
          <source src={src} type="video/mp4" />
        </video>
      );
      // case VIDEO_FORMAT_ENUM.IFRAME:
      //   return (
      //     <iframe
      //       style={{ gridColumn: '2/3' }}
      //       width="560"
      //       height="315"
      //       src={src}
      //       title={title}
      //       frameborder="0"
      //       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      //       allowfullscreen
      //     />
      //   );
      break;
  }
}
