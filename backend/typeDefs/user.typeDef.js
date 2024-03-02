
// the ! mean that the value is required

// type Query => pour spécifier nos différentes requêtes

/**
 * par exemple la requêtes users va retourner un array de User
 */


const userTypeDef = `#graphql
    type User {
        _id: ID!
        username: String!
        name: String!
        password: String!
        profilePicture: String
        gender: String!
    }

    type Query {
        # users: [User!]
        authUser: User #get the user who is logged in
        user(userId:ID!): User
    }

    type Mutation {
        signUp(input: SignUpInput!): User
        login(input: LoginInput!): User
        logout: LogoutResponse
    }

    input SignUpInput {
        username: String!
        name: String!
        password: String!
        gender: String!

    }
    input LoginInput {
        username: String!
        password: String!
    }

    type LogoutResponse {
        message: String!
    }
`

export default userTypeDef