import axios from "axios";

const sendDataToServer = () => {
  const data = {
    cartId: "67fb8e201f70bf74520565e7",
    items: [
      { _id: "abc123", title: "Apple", quantity: 2, price: 20 },
      { _id: "def456", title: "Banana", quantity: 3, price: 30 },
    ],
  };

  axios
    .post("http://localhost:5000/api/carts/add", data) // Gửi dữ liệu tới server
    .then((response) => {
      console.log("Data sent successfully:", response.data);
    })
    .catch((error) => {
      console.error("Error sending data:", error);
    });
};

function Test() {
  return (
    <div>
      <h1>Test Page</h1>
      <button onClick={sendDataToServer}>Send Data</button>
    </div>
  );
}

export default Test;
