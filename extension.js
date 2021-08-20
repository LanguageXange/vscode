const vscode = require("vscode");
const axios = require("axios");
const xmlParser = require("fast-xml-parser");

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  const url = "https://zerotomastery.io/rss.xml";
  const res = await axios.get(url);
  const posts = xmlParser.parse(res.data).rss.channel.item.map((post) => {
    return {
      label: post.title,
      detail: post.description,
      link: post.link,
    };
  });

  let disposable = vscode.commands.registerCommand(
    "ztm-blog.searchposts",
    async function () {
      const selected_post = await vscode.window.showQuickPick(posts, {
        matchOnDetail: true,
        title: "Select a post",
        placeHolder: "Typing blog post title here ...",
      });
      if (selected_post == null) {
        vscode.window.showInformationMessage(
          "Oooops! Did you forget to select a blog post? 😅😅"
        );
      } else {
        vscode.env.openExternal(selected_post.link);
      }
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
