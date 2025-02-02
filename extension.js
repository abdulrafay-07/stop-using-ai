const vscode = require("vscode");

function activate(context) {
	const disposable = vscode.commands.registerCommand("stop-using-ai.startBrain", function () {
		vscode.window.showErrorMessage(
			"Looks like you encountered an error!",
			"Start",
		).then((selection) => {
			if (selection === "Start") {
				const panel = vscode.window.createWebviewPanel(
					"timerView",
					"Time To Lock In",
					vscode.ViewColumn.One,
					{ enableScripts: true },
				);
				panel.webview.html = getHTML();

				panel.webview.onDidReceiveMessage((message) => {
					if (message.command === "done") {
						vscode.window.showInformationMessage("Well done!");
						panel.dispose();
					} else if (message.command === "timeUp") {
						vscode.window.showInformationMessage(
							"Time is up! What you should do next:",
							"📖 Read Docs",
							"🔍 Search StackOverflow",
							"🤖 Ask AI (but not for code)"
						).then((selection) => {
							if (selection === "🔍 Search StackOverflow") {
								vscode.env.openExternal(vscode.Uri.parse("https://stackoverflow.com/"));
							} else if (selection === "🤖 Ask AI (but not for code)") {
								vscode.env.openExternal(vscode.Uri.parse("https://chat.openai.com/"));
							};
						});
						panel.dispose();
					};
				});
			};
		})
	});

	context.subscriptions.push(disposable);
};

function getHTML() {
	return `
	<!DOCTYPE html>
	<html>
		<head>
			<meta charset="UTF-8">
			<style>
				.container {
					display: flex;
					flex-direction: column;
				}

				.text {
					display: flex;
					flex-direction: column;
				}

				#btn {
					border-radius: 16px;
					border: none;
					background-color: #0078d7;
					color: #fff;
					cursor: pointer;
					padding: 5px 10px;
					width: fit-content;
				}

				#link {
					margin-top: 40px;
				}

				#link a {
					text-decoration: none;
					margin-top: auto;
				}
			</style>
		</head>
		<body>
			<div class="container">
				<div class="text">
					<h2>Time To Lock In</h2>
					<p id="timer">Timer: 30:00</p>
				</div>
				<button id="btn" onclick="done()">Done</button>
				<div id="link"><a href="https://github.com/abdulrafay-07" target="_blank">Follow on Github :)</a></div>
			</div>
			
			<script>
				const vscode = acquireVsCodeApi();

				let timeLeft = 30 * 60;

				function updateTimer() {
					let minutes = Math.floor(timeLeft / 60);
					let seconds = timeLeft % 60;
					document.getElementById("timer").innerText = 
						\`Timer: \${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
					
					if (timeLeft > 0) {
						timeLeft--;
						setTimeout(updateTimer, 1000);
					} else {
						vscode.postMessage({ command: "timeUp" })
					};
				};

				window.onload = updateTimer;

				function done() {
					vscode.postMessage({ command: "done" });
				};
			</script>
		</body>
   </html>`;
};

function deactivate() {};

module.exports = {
	activate,
	deactivate,
};
