document.addEventListener("DOMContentLoaded", () => {
    const peer = new Peer();  // Create a new PeerJS instance

    const fileInput = document.getElementById("fileInput");
    const shareButton = document.getElementById("shareButton");
    const peerIdDisplay = document.getElementById("peerId");
    const receiverIdInput = document.getElementById("receiverId");
    const connectButton = document.getElementById("connectButton");

    // Display Peer ID for sender to share
    peer.on('open', (id) => {
        peerIdDisplay.textContent = id;
    });

    // Handle file share button click
    shareButton.addEventListener("click", () => {
        const file = fileInput.files[0];
        if (!file) {
            alert("Please select a file to share.");
            return;
        }

        const receiverId = receiverIdInput.value.trim();
        if (!receiverId) {
            alert("Please enter the receiver's Peer ID.");
            return;
        }

        const conn = peer.connect(receiverId);
        conn.on('open', () => {
            conn.send({ fileName: file.name, fileData: file });
            alert(`File "${file.name}" sent successfully.`);
        });

        conn.on('error', (err) => {
            console.error("Error in connection:", err);
        });
    });

    // Handle incoming connection
    peer.on('connection', (conn) => {
        conn.on('data', (data) => {
            const { fileName, fileData } = data;
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(new Blob([fileData]));
            downloadLink.download = fileName;
            downloadLink.textContent = `Download ${fileName}`;
            document.body.appendChild(downloadLink);
        });

        conn.on('error', (err) => {
            console.error("Error in connection:", err);
        });
    });
});
