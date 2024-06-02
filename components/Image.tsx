import NextImage from 'next/image';

export function Image({ image, layout, props }: any) {
  //to do : add a placeholder image if src is undefined
  const { altText, height, src, width } = image;

  return (
    <NextImage
      {...props}
      {...(layout !== 'fill' && {
        height,
        width,
      })}
      alt={altText}
      src={src}
      unoptimized={true}
    />
  );
}
