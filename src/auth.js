module.exports = {
    
    'facebookAuth' : {
        'clientID'        : '1723116131034123', // your App ID
        'clientSecret'    : '47f331cea0643159532f8d298c711392', // your App Secret
        // 'callbackURL'     : 'http://localhost:3001/auth/facebook/callback',
        'callbackURL'     : 'https://botanyauth.herokuapp.com/auth/facebook/callback',
        'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'callbackaddress':'https://botanyauth.herokuapp.com/auth/fb/callback'

    },

    'twitterAuth' : {
        'consumerKey'        : 'PvlM9zJMcNbgMtgzR1Ddf2CTC',
        'consumerSecret'     : '7xvan9d5o3Fctgs81GAB7nLrY2uUeJJluMM3LRHbnEVCNOSbIG',
        'callbackURL'        : 'http://localhost:3001/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'         : '538286382967-d7svs494sklg5kohdff3lgekfvpm58ht.apps.googleusercontent.com',
        'clientSecret'     : 'o1i5VWDq-o-qAizZstvOGA5U',
        'callbackURL'      : 'http://localhost:3001/auth/oauth/callback'
    },
    'localAuth':{
        
    },

    'linkedInAuth':{
        'clientID':'77tofmst70k8n8',
        'consumerSecret':'I36ZLmEwK3JiLNE6',
        'callbackURL':'http://localhost:3001/auth/linkedin/callback'
    }

};