const solve = async (clue, clueType) => {
  var obj = { clue: clue }
  let url = 'https://prod.api.cryptario.net/'
  if (window.location.hostname !== 'cryptario.net') {
    url = 'https://stage.api.cryptario.net/'
  }
  var response = await fetch(url + clueType, {
     method: 'post',
     body: JSON.stringify(obj)
  })
  var solution =  await response.json()
  //return ["Taylor Swift"]
  return solution
}

// looks for URL changes after the # character
window.onhashchange = function() {
  // behave as if the app has just loaded for the first time
  app.onCreated()
}

var app = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: {
    clue: '',
    drawer: false,
    progress: 0,
    solving: false,
    solutions: [],
    cryptic: '',
    showResults: false
  },
  // when the app loads
  created: function () {
    // call the onCreated method
    this.onCreated()
  },
  methods: {
    onCreated: function() {
      // scroll to top of page
      window.scrollTo(0, 0)
      // find the # part of the URL
      let hash = window.location.hash
      // remove the hash character
      hash = hash.replace(/^#/,'')
      // remove URL encoding
      hash = decodeURIComponent(hash)
      console.log(hash)
      // if there is text after the hash
      if (hash) {
        // fill in the form and solve the anagram
        this.cryptic = hash
        this.solveCryptic()
      }
    },
    solveCryptic: async function () {
      console.log('solveCryptic', this.cryptic)
      if (this.solving) {
        console.log('already solving')
        return
      }
      if (this.cryptic == "") {
        return 
      }
      window.location.hash = '#'+this.cryptic
      this.solving = true
      this.showResults = false
      const self = this
      self.solutions = []
      self.progress = 0
      const increment = 100/8

     const clueTypes = ["anagram", "hiddenwords", "containers", "reversals", "doubledef", "charades", "homophones", "subtractions"]

     for (var i in clueTypes) {
       var clueType = clueTypes[i]
       solve(this.cryptic, clueType).then(function(solutions) {
         self.solutions = self.solutions.concat(solutions)
         self.progress += increment
         console.log('finished', clueType, self.progress, self.showResults)
         if (self.progress === 100) {
           self.solving = false
           self.showResults = true
         }
       }).catch(function(err) {
         self.progress += increment
         if (self.progress === 100) {
           self.solving = false
           self.showResults = true
         }
         console.log (clueType, " err ", err)
       })
     }  //end for
   } // analyze
  } //methods
})
