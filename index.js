addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
	const NAME = 'experiment-0'
	let url = 'https://cfw-takehome.developers.workers.dev/api/variants';
	obj = await (await fetch(url)).json();
	
	//A/B and cookies is from https://developers.cloudflare.com/workers/templates/pages/ab_testing/
	const cookie = request.headers.get('cookie')
	if (cookie && cookie.includes(`${NAME}=varone`)) {
		return await fetch(obj.variants[0]);
	} else if(cookie && cookie.includes(`${NAME}=vartwo`)) {
		return await fetch(obj.variants[1]);
	} else {
		let group = Math.random() < 0.5 ? 'varone' : 'vartwo' // 50/50 split
		let response = group === 'varone' ? await fetch(obj.variants[0]) : await fetch(obj.variants[1]);
		response = new Response(response.body, response)
		response.headers.append('Set-Cookie', `${NAME}=${group}; path=/`)
		return response;
	}	
}


