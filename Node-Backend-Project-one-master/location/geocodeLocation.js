import NodeGeocoder from "node-geocoder";

export const getPosition = async (address) => {
  try {
    const geocoder = NodeGeocoder({
      provider: "opencage",
      apiKey: "6862359f6e134db1bfb74321c4afc8d6",
    });

    return new Promise((resolve, reject) => {
      geocoder.geocode(address, function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res[0]);
        }
      });
    });
  } catch (error) {
    console.log("Error", error);
  }
};
