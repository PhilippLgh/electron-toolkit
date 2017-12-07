class App {
    showUserInfo(content, callback) {
        window.vueApp.showToast({
            content: content,
            callback: callback
        })
    }

    showUserError(content) {
        window.vueApp.showToast({
            content: content,
            isError: true
        });
    }

    openLink(link) {
        window.Toolkit.openLink(link);
    }

    openExplorer(location) {
        window.Toolkit.openInExplorer(location);
    }
}

const app = new App();
export default app;