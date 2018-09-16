class APIHandler {
  constructor(bot) {
    this.bot = bot;
    this.news.bind(this);
  }

  news (req, res) {
    var requiredFields = ['id', 'author', 'category', 'title', 'slug', 'excerpt'];
    var missingFields = [];
  
    requiredFields.forEach(field => {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    });
  
    if (missingFields.length > 0) {
      console.error("[app.post /news] Missing required fields:", missingFields);
      return res.status(422).send({ message: "Missing required fields.", fields: missingFields });
    }

    var url = `https://arvale.world/news/${req.body.id}-${req.body.slug}`;
  
    this.bot.sendMessage({
      to: '479314335831818240', // #announcements
      message: url,
      embed: {
        color: 0xdbc19b,
        url: url,
        title: req.body.title,
        description: req.body.excerpt,
        footer: { 
          text: `Posted by ${req.body.author} in ${req.body.category}`
        }
      }
    }, (error, response) => {
      if (error) {
        console.error(error);
        return res.status(500).send({ message: 'An error occurred when attempting to send the message to Discord' });
      }
  
      return res.status(200).send({ message: 'Posted' });
    });
  }
}

module.exports = APIHandler;
