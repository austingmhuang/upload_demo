export default async function extractFramesFromVideo(videoURL, fps = 25) {
  return new Promise(async resolve => {
    let video = document.createElement("video");

    let seekResolve;
    video.addEventListener("seeked", async () => {
      if (seekResolve) seekResolve();
    });

    video.src = videoURL;

    while (
      (video.duration === Infinity || isNaN(video.duration)) &&
      video.readyState < 2
    ) {
      await new Promise(r => setTimeout(r, 1000));
      video.currentTime = 1000000 * Math.random();
    }
    let duration = video.duration;

    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");
    let [w, h] = [video.videoWidth, video.videoHeight];
    canvas.width = w;
    canvas.height = h;

    let frames = [];
    let interval = 300;
    let currentTime = 0;

    while (currentTime < duration) {
      video.currentTime = currentTime;
      await new Promise(r => (seekResolve = r));

      context.drawImage(video, 0, 0, w, h);
      let base64ImageData = canvas.toDataURL();
      frames.push(base64ImageData);
      console.log(duration);
      console.log(currentTime);
      currentTime += interval;
    }
    console.log("done");
    resolve(frames);
  });
}
