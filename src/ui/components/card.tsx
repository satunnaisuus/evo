import * as React from "react";
import styled from "styled-components";

type Props = {
    children?: React.ReactNode;
}

const StyledCard = styled.div<Props>`
    border-radius: 10px;
    background: #404042;
    padding: 15px;

    & + & {
        margin-top: 10px;
    }
`;

export const Card = (props: Props) => (
    <StyledCard {...props}>
        {props.children}
    </StyledCard>
)