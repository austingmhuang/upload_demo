export default async function postData(
  data,
  ipAddress = "3.236.97.79",
  port = "8080",
  model = "densenet161"
) {
  try {
    const response = await fetch(
      `http://${ipAddress}:${port}/predictions/${model}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "image/jpeg"
        },
        body: data
      }
    );

    return await response.json();
  } catch (error) {
    return { error: 100 };
  }
}
