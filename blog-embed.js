/**
 * Problem with Medium's RSS feed not having adequate CORS header 
 * either needs proxy to first make request and feed it back to client
 * or need a proxy converter from RSS to JSON
 * 
 */

const rssFeedUrl = 'https://medium.com/feed/@nadyasemenova-writes';
const blogContainer = document.getElementById('medium-blog-container');
const postWrapper = document.createElement('div');
postWrapper.classList.add('post-wrapper');
const numBlogPosts = 10;
fetch(rssFeedUrl, {mode: 'no-cors'}) // no cors make request useless but at least it is getting sent TODO
    .then(response => response.text())
    .then(xmlText => {
        // parse the XML response
        const xmlParser = new DOMParser();
        const xmlDoc = xmlParser.parseFromString(xmlText, 'text/xml');
        const rss = xmlDoc.getElementsByTagName('rss')[0];
        const channel = rss.getElementsByTagName('channel')[0];

        // extract the blog title and list of blog posts
        // const blogTitle = channel.getElementsByTagName('title')[0].textContent;
        const blogPosts = channel.getElementsByTagName('item');

        // create HTML elements to display the blog content
        const titleElement = document.createElement('div');
        // titleElement.textContent = blogTitle;
        // titleElement.classList.add('blog-title'); // add a class to the title element
        blogContainer.appendChild(titleElement);

        const postListElement = document.createElement('ul');
        postListElement.classList.add('blog-post-list');
        for (let i = 0; i < numBlogPosts; i++) {
            const post = blogPosts[i];
            const postLink = post.getElementsByTagName('link')[0].textContent;
            const postTitle = post.getElementsByTagName('title')[0].textContent;
            const postContent = extractContent(post);
            const postElement = document.createElement('li');
            const postContainer = document.createElement('a');
            postContainer.setAttribute('href', postLink);
            postElement.classList.add('blog-post-item');
            const postLinkElement = document.createElement('a');
            postLinkElement.setAttribute('href', postLink);
            postLinkElement.textContent = postTitle;
            const postContentElement = document.createElement('p');
            postContentElement.textContent = postContent;
            postElement.appendChild(postLinkElement);
            postElement.appendChild(postContentElement);
            postContainer.appendChild(postElement);
            postListElement.appendChild(postElement);

        }
        blogContainer.appendChild(postListElement);
    })
    .catch(error => console.error(error));


function extractContent(post) {
    let postContent = '';
    const encodedContent = post.getElementsByTagName('content:encoded')[0];
    if (encodedContent) {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(encodedContent.textContent, 'text/html');
        const firstTag = htmlDoc.querySelector('p');
        if (firstTag) {
            postContent = firstTag.textContent;
        }
    } else {
        const description = post.getElementsByTagName('description')[0];
        if (description) {
            postContent = description.textContent;
        }
    }
    // Extract the first 25 words from the post content
    const words = postContent.split(' ');
    const truncatedContent = words.slice(0, 20).join(' ');
    return `${truncatedContent} ... `;
}
