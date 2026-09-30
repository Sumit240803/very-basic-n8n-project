const welcome=async(req, res)=> {
    try {
    const { name, email } = req.body;

    // Basic validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required"
      });
    }

    // Data we want to send to n8n
    const payload = {
      name,
      email: email || null,
      timestamp: new Date().toISOString()
    };

    console.log("Sending to n8n:", payload);
    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
    console.log("N8N URL:", process.env.N8N_WEBHOOK_URL);
    // Call n8n webhook
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    // Check n8n response
    if (!n8nResponse.ok) {
      throw new Error(
        `n8n returned status ${n8nResponse.status}`
      );
    }

    const n8nData = await n8nResponse.json();

    console.log("Response from n8n:", n8nData);

    // Return n8n result to client
    return res.status(200).json({
      success: true,
      message: "Workflow executed successfully",
      data: n8nData
    });

  } catch (error) {
    console.error("n8n error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to execute n8n workflow",
      error: error.message
    });
  }
}

module.exports = {welcome};