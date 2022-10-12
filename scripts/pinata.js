/** @format */

// /** @format */

// const axios = require("axios");
// const FormData = require("form-data");
// import { create as ipfsHttpClient } from "ipfs-http-client";

// const pinataAPIKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
// const pinataSecretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

// const UploadtoIPFS = async (JSONBody) => {
//   const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
//   console.log("UploadtoIPFS");

//   return axios
//     .post(url, JSONBody, {
//       headers: {
//         pinata_api_key: pinataAPIKey,
//         pinata_secret_api_key: pinataSecretKey,
//       },
//     })
//     .then(function (response) {
//       return {
//         success: true,
//         pinataURL:
//           "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
//       };
//     })
//     .catch(function (error) {
//       console.log(error);
//       console.log("------------------------------------------------");

//       return {
//         success: false,
//         message: error.message,
//       };
//     });
// };

// const uploadFileToIPFS = async (file) => {
//   const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
//   let data = new FormData();
//   console.log("uploadFileToIPFS");
//   console.log(file);

//   data.append("file", file);

//   return axios
//     .post(url, data, {
//       headers: {
//         "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
//         pinata_api_key: pinataAPIKey,
//         pinata_secret_api_key: pinataSecretKey,
//       },
//     })
//     .then(function (response) {
//       console.log("image uploaded", response.data.IpfsHash);
//       return {
//         success: true,
//         pinataURL:
//           "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
//       };
//     })
//     .catch(function (error) {
//       console.log(error);
//       console.log("------------------------------------------------");
//       return { success: false, message: error.message };
//     });
// };

// module.exports = { UploadtoIPFS, uploadFileToIPFS };

// // export default function Headers() {
// //   return (
// //     <div>
// //       <h1>{pinataAPIKey}</h1>
// //       <h1>hi</h1>
// //     </div>
// //   );
// // }

// // const UploadtoIPFS = async (JSONBody) => {
// //   const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
// //   console.log("UploadtoIPFS");

// //   return axios
// //     .post(url, JSONBody, {
// //       headers: {
// //         pinata_api_key: pinataAPIKey,
// //         pinata_secret_api_key: pinataSecretKey,
// //       },
// //     })
// //     .then(function (response) {
// //       return {
// //         success: true,
// //         pinataURL:
// //           "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
// //       };
// //     })
// //     .catch(function (error) {
// //       console.log(error);
// //       console.log("------------------------------------------------");

// //       return {
// //         success: false,
// //         message: error.message,
// //       };
// //     });
// // };

// // const uploadFileToIPFS = async (file) => {
// //   const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
// //   let data = new FormData();
// //   console.log("uploadFileToIPFS");
// //   console.log(file);

// //   data.append("file", file);
// //   data.append("name", "dharshan");

// //   const metadata = JSON.stringify({
// //     name: "testname",
// //     keyvalues: {
// //       exampleKey: "exampleValue",
// //     },
// //   });
// //   data.append("pinataMetadata", metadata);
// //   console.log(data);

// //   return axios
// //     .post(url, data, {
// //       maxBodyLength: "Infinity",
// //       header: {
// //         "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
// //         pinata_api_key: pinataAPIKey,
// //         pinata_secret_api_key: pinataSecretKey,
// //       },
// //     })
// //     .then(function (response) {
// //       console.log("image uploaded", response.data.IpfsHash);
// //       return {
// //         success: true,
// //         pinataURL:
// //           "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
// //       };
// //     })
// //     .catch(function (error) {
// //       console.log(error);
// //       console.log("------------------------------------------------");
// //       return { success: false, message: error.message };
// //     });
// // };

// // module.exports = { UploadtoIPFS, uploadFileToIPFS };
