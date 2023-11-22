describe('Blog app', () => {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }

    const user2 = {
      name: 'cant delete',
      username: 'cantdelete',
      password: 'delete'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user) 
    cy.request('POST', 'http://localhost:3001/api/users/', user2) 
    cy.visit('http://localhost:5173/')
  })

  it('passes', () => {
    cy.contains('login')
  })

  describe('login', () => {
    it('succeeds with correct credentials', () => {
      cy.contains('login').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with incorrect credentials', () => {
      cy.contains('login').click()
      cy.get('#username').type('wrong')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })

  describe('when logged in', () => {
    beforeEach(() => {
      cy.login({ username: 'mluukkai', password: 'salainen' })

      cy.createBlog({
        title: 'a new blog',
        author: 'a new authoer',
        url: 'https://www.google.com'
       })
    })

    it('a logged in user can add a blog', () => {
      cy.contains('new blog').click()
      cy.get('#title').type('test')
      cy.get('#author').type('author')
      cy.get('#url').type('https://www.google.com/')
      cy.get('#post').click()
      cy.get('.success').should('contain', 'a new blog test by author added')
        .and('have.css', 'border-style', 'solid')
        .and('have.css', 'color', 'rgb(0, 128, 0)')

      cy.get('html').should ('contain', 'author')
    })

    it('a logged in user can like a blog', () => {
      cy.contains('a new blog')
        .contains('view').click()
      cy.contains('like').click()
      cy.contains(1)
    })

    it('a logged in user can delete their blog', () => {
      cy.contains('a new blog')
        .contains('view').click()
      cy.contains('Remove').click()
      cy.should('contain.not', 'a new blog')
      
    })
    
    it('cant delete another users blog', () => {
      cy.contains('logout').click()
      cy.request('POST', 'http://localhost:3001/api/login', {
        username: 'cantdelete', password: 'delete'
      }).then(response => {
        localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
        cy.visit('http://localhost:5173')
        cy.contains('a new blog').as('blogtodelete').contains('view')
          .click()
        cy.get('@blogtodelete').should('contain.not', 'Remove')
      })
    })
  })

  describe('organizes a bunch of posts by likes', () => {
    beforeEach(() => {
      cy.login({ username: 'mluukkai', password: 'salainen' })

      for (let i = 1; i <= 10; i++) {
        cy.createBlog({
          title: `blog has ${i} likes`,
          author: 'a new authoer',
          url: 'https://www.google.com',
          likes: i
         })
      }
    })

    it('sorted blogs', () => {
     
    cy.get('.blog').each((element, index, array) => {
      cy.wrap(element)
        .should('contain', `blog has ${array.length - index} likes`)
    })
    })

  })
})