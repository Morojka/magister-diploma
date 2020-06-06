import app from './app';
import bot from './soc-net';

bot.startPolling();

app.listen(process.env.PORT, function () {
    console.log('Example app listening on port 5000!');
});
