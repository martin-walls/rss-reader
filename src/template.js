const DEPLOYMENT_URL = "https://rss-reader.martinwalls.com";

const forEach = (arr, fn) => {
    let str = "";
    arr.forEach((i) => (str += fn(i) || ""));
    return str;
};

const article = (item) => `
  <article class="item">
    <header class="item__header">
      <a href="${item.link}" target='_blank' rel='noopener norefferer nofollow'>
        ${item.title /* TODO: sanitize this in case it contains HTML elements */}
      </a>
    </header>

    <small>
      ${item.feedUrl
        ? `<span class="item__feed-url monospace">${item.feedUrl}</span>`
        : ""
    }
      <ul class="article-links">
        <li>${item.blogtitle}</li>
        <li class="monospace">${item.timestamp || ""}</li>
        ${item.comments
        ? `
          <li><a href="${item.comments}" target='_blank' rel='noopener norefferer nofollow'>comments</a></li>
        `
        : ""
    }
      </ul>
    </small>
  </article>
`;

export const template = ({ allItems, groups, errors, now }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Reader</title>
  <link rel="stylesheet" href="${DEPLOYMENT_URL}/style.css">
</head>
<body>
  <div class="app">
    <input type="checkbox" class="btn-hide-sidebar" id="btn-hide-sidebar" />
    <label for="btn-hide-sidebar" class="btn-hide-sidebar-label monospace"></label>

    <div class="sidebar">
      <header>
        <ul class="group-selector">
          <!-- "All articles" view is shown by default when no section is targeted -->
          <li><a href="#">all articles</a></li>
          ${forEach(
    groups,
    (group) => `
            <li><a href="#${group[0]}">${group[0]}</a></li>
          `,
)}
        </ul>
      </header>

      <footer>
        ${errors.length > 0
        ? `
          <h2>Errors</h2>
          <p>There were errors trying to parse these feeds:</p>
          <ul>
          ${forEach(
            errors,
            (error) => `
            <li>${error}</li>
          `,
        )}
          </ul>
        `
        : ""
    }

        <p>
          Last updated ${now}. Powered by <a href="https://github.com/kevinfiol/rss-reader">Bubo Reader</a>, a project by <a href="https://george.mand.is">George Mandis</a> and <a href="https://kevinfiol.com">Kevin Fiol</a>.
        </p>
      </footer>
    </div>

    <main>
      ${forEach(
        groups,
        ([groupName, feeds]) => `
        <section id="${groupName}">
          <h1>${groupName}</h1>

          ${forEach(
            feeds,
            (feed) => `
            <details>
              <summary>
                <span class="feed-title">${feed.title}</span>
                <span class="feed-url">
                  <small>
                    (${feed.feed})
                  </small>
                </span>
                <div class="feed-timestamp">
                  <small>Latest: ${(feed.items[0] && feed.items[0].timestamp) || ""
                }</small>
                </div>
              </summary>
              ${forEach(feed.items, (item) => article(item))}
            </details>
          `,
        )}
        </section>
      `,
    )}

    <!-- Must come after all other sections, so that it can be shown by default
         using CSS. -->
      <section id="all-articles">
        <h1>all articles</h1>
        ${forEach(allItems, (item) => article(item))}
      </section>
    </main>
  </div>
</body>
</html>
`;
