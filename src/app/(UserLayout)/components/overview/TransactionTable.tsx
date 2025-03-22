
import {
    Typography, Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    CardHeader,
    Chip,
    Divider,
    CardActions,
    Button
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const products = [
    {
        description: "Purchase",
        post: "TV, Phone & Internet",
        date: "March 14",
        // priority: "Low",
        // pbg: "primary.main",
        amount: "2.42",
        balance: "3.99",
    },
    {
        description: "e-Transfer From: JOHN DOE",
        post: "Miscellaneous Income",
        date: "March 14",
        // priority: "Medium",
        // pbg: "secondary.main",
        amount: "2.99",
        balance: "200890.52",
    },
    {
        description: "Purchase",
        post: "Fast Food",
        date: "March 14",
        // priority: "High",
        // pbg: "error.main",
        amount: "2.99",
        balance: "12.81",
    },
    {
        description: "Purchase",
        post: "TV, Phone & Internet",
        date: "March 14",
        // priority: "Critical",
        // pbg: "success.main",
        amount: "2.40",
        balance: "2.40",
    },
];


const ProductPerformance2 = () => {
    return (

    <Box>
              <CardHeader title="Latest Transactions" />
              <Divider />
        <Table
            aria-label="simple table"
            sx={(theme) => ({
            whiteSpace: "nowrap",
            mt: 2,
            })}
        >
        <TableHead>
            <TableRow>
            <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                        Date
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                        Description
                    </Typography>
                </TableCell>
        
                {/* <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                        Priority
                    </Typography>
                </TableCell> */}
                    <TableCell align="right">
                    <Typography variant="subtitle2" fontWeight={600}>
                        Amount
                    </Typography>
                </TableCell>
                <TableCell align="right">
                    <Typography variant="subtitle2" fontWeight={600}>
                        Balance
                    </Typography>
                </TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {products.map((product) => (
                <TableRow hover key={product.date}>
            
                    <TableCell>
                        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                            {product.date}
                        </Typography>
                    </TableCell>
                    <TableCell>
                    <Box
                        sx={(theme) => ({
                            maxWidth: '350px', // Reduce from 520px to 350px for better fit
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            [theme.breakpoints.down('md')]: {
                            maxWidth: '200px', // Reduce further for medium screens
                            },
                            [theme.breakpoints.down('sm')]: {
                            maxWidth: '125px',
                            },
                        })}
                        >
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                                {product.description}
                            </Typography>
                            <Typography
                                color="textSecondary"
                                sx={{
                                    fontSize: "13px",
                                }}
                            >
                                {product.post}
                            </Typography>
                        </Box>
                        </Box>
                </TableCell>
                <TableCell align="right">
                    <Typography variant="h6">${product.amount}</Typography>
                </TableCell>
                <TableCell align="right">
                    <Typography variant="h6">${product.balance}</Typography>
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
    </Table>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button
              color="inherit"
              endIcon={<ArrowForwardIosIcon fontSize="small" />}
              size="small"
              variant="text"
            >
              View all
            </Button>
          </CardActions>
</Box>

    );
};

export default ProductPerformance2;
