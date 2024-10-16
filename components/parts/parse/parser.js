import parse from 'html-react-parser'


export const ParseHtml = ({ html }) => {
    return(
      <>
          {parse(`${html}`)}
      </>
    )
}