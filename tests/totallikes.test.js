const totalLikes = require('../utils/list_helper').totalLikes


describe('total likes', () => {

  test('of 2 blogs', () => {
    const result = totalLikes([
      {
        "title": "String",
        "author": "String",
        "url": "String",
        "likes": 9,
        "id": "6543e056effc36ed89ab8740"
      },
      {
        "title": "String",
        "author": "String",
        "url": "String",
        "likes": 9,
        "id": "6543f5785f1ab25f8bbad402"
      }
    ])
    expect(result).toBe(18)
  })

// API returns single object, this test fails in that case
  test('of 1 blog', () => {
    const result = totalLikes([{
      "title": "String",
      "author": "String",
      "url": "String",
      "likes": 20,
      "id": "6543e056effc36ed89ab8740"
    }])
    expect(result).toBe(20)
  })

  test('of 0 blogs', () => {
    const result = totalLikes([])
    console.log(result)
    expect(result).toBe(0)
  })
})
