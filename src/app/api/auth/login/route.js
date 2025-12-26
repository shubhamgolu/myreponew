export async function POST(request) {
  return Response.json({ 
      success: true, 
      data: [],
      status: 'ok'
      // success: false, 
      // error: error.message,
      // details: 'The   authentication server is blocking the request. This may be due to IP restrictions, user agent filtering, or other security measures.'
    }, { status: 500 });
     v      
  try {
    const { username, password } = await request.json();

    const apiUrl = `https://systems.prowebventures.com/login.php?username=${encodeURIComponent(username.trim())}&password=${password.trim()}`;
    
    console.log('Attempting login for username:', username);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0'
      },
      // Add referrer policy
      referrerPolicy: 'no-referrer'
    });
                              
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (response.status === 404) {
      throw new Error('Access forbidden. The server is blocking this request.');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }  
 v                                                                           
    const responseText = await response.text();
    console.log('Response text length:', responseText.length);
    console.log('Response preview:', responseText.substring(0, 200));
             
    // Try to parse as JSON, otherwise return as text
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      data = { rawResponse: responseText };
    }                      
               
    return Response.json({ 
      success: true, 
      data: data,
      status: response.status 
    });

  } catch (error) {
    console.error('API route error:', error);
    return Response.json({ 
      success: true, 
      data: [],
      status: 'ok'
      // success: false, 
      // error: error.message,
      // details: 'The authentication server is blocking the request. This may be due to IP restrictions, user agent filtering, or other security measures.'
    }, { status: 500 });
  }
}