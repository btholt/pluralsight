const React = require('react');
const _ = require('lodash');
const $ref = falcor.Model.ref;
const $atom = falcor.Model.atom;


const model = new falcor.Model({
    cache: {
        ingredientsById: {
            1: {
                name: "Flour",
                description: "white and powdery"
            },
            2: {
                name: "Chocolate Chips",
                description: "delicious"
            },
        },
        recipes: [
            {
                name: "Cookies",
                instructions: "Bake them lol",
                ingredients: [
                    $ref("ingredientsById[1]"),
                    $ref("ingredientsById[2]")
                ],
                authors: $atom(["Brian", "John", "Other Person"])
            },
            {
                name: "Brownies",
                instructions: "Also bake them rofl",
                ingredients: [
                    $ref("ingredientsById[1]")
                ],
                authors: $atom(["Ringo", "Sam"])
            }
        ]
    }
});

// model.get('recipes[0..1].ingredients[0..9]["name","description"]', 'recipes[0..1]["name","instructions", "authors"]')
//     .then( data => {
//         console.log(data);
//     });

const App = React.createClass({
    render() {
        return (
            <div>
                <RecipeList />
            </div>
        );
    }
});

const RecipeList = React.createClass({
    getInitialState() {
        return {
            recipes: []
        };
    },
    componentWillMount() {
        model.get(
            ['recipes', { from: 0, to: 9 }, Recipe.queries.recipe() ],
            ['recipes', { from: 0, to: 9 }, 'ingredients', {from: 0, to: 9}, Ingredients.queries.ingredients()  ]
        )
            .then( data => {
                this.setState({
                    recipes: _.values(data.json.recipes)
                });
                console.log(_.values(data.json.recipes));
            });
    },
    render() {
        return (
            <div>
                {this.state.recipes.map( (recipe, index) => {
                    return (
                        <Recipe key={index} {...recipe} />
                    );
                })}
            </div>
        );
    }
});

const Recipe = React.createClass({
    statics: {
        queries: {
            recipe() {
                return _.union( Name.queries.recipe(), Instructions.queries.recipe() );
            },
            ingredients() {
                return Ingredients.queries.ingredients()
            }
        }
    },
    render() {
        return (
            <div>
                <Name {..._.pick(this.props, Name.queries.recipe()) } />
                <Instructions {..._.pick(this.props, Instructions.queries.recipe()) } />
                <Ingredients ingredients={this.props.ingredients} />
            </div>
        );
    }
});

const Name = React.createClass({
    statics: {
        queries: {
            recipe() {
                return ["name", "authors"];
            }
        }
    },
    render() {
        return (
            <div>
                <h1>{this.props.name}</h1>
                <h1>{JSON.stringify(this.props.authors)}</h1>
            </div>
        );
    }
});



const Instructions = React.createClass({
    statics: {
        queries: {
            recipe() {
                return ["instructions"];
            }
        }
    },
    render() {
        return (
            <h1>{this.props.instructions}</h1>
        );
    }
});

const Ingredients = React.createClass({
    statics: {
        queries: {
            ingredients() {
                return ["name", "description"];
            }
        }
    },
    render() {
        return (
            <h1>{JSON.stringify(this.props.ingredients)}</h1>
        );
    }
});




React.render( <App/>, window.document.getElementById('target') );