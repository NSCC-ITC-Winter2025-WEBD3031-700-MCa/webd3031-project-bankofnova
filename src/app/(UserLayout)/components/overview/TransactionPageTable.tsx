
import {
    Typography, Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip
} from '@mui/material';
import DashboardCard from '../shared/DashboardCard';

const products = [
    {
        description: "Purchase",
        post: "TV, Phone & Internet",
        date: "March 14",
        // priority: "Low",
        // pbg: "primary.main",
        amount: "2.49",
        account: "3.99",
    },
    {
        description: "e-Transfer From: JOHN DOE",
        post: "Miscellaneous Income",
        date: "March 14",
        // priority: "Medium",
        // pbg: "secondary.main",
        amount: "2.42",
        account: "24.51",
    },
    {
        description: "Purchase",
        post: "Fast Food",
        date: "March 14",
        // priority: "High",
        // pbg: "error.main",
        amount: "2.49",
        account: "12.89",
    },
    {
        description: "Purchase",
        post: "TV, Phone & Internet",
        date: "March 14",
        // priority: "Critical",
        // pbg: "success.main",
        amount: "2.49",
        account: "2.49",
    },
];


const ProductPerformance = () => {
    return (

        <DashboardCard title="Transaction Breakdown">
            <Box sx={{ overflow: 'auto'}}>
                <Table
                    aria-label="simple table"
                    sx={{
                        whiteSpace: "nowrap",
                        mt: 2
                    }}
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
                                    Account
                                </Typography>
                            </TableCell>
                                  <TableCell align="right">
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Amount
                                </Typography>
                            </TableCell>
                
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.date}>
                        
                                <TableCell>
                                    <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                                        {product.date}
                                    </Typography>
                                </TableCell>
                                <TableCell>
    <Box
                 sx={(theme) => ({
                    // backgroundColor: 'black', 
                    maxWidth: '520px',  // Smaller max width for small screens
                    overflow: 'hidden',  // Hide overflowed text
                    textOverflow: 'ellipsis',  // Display ellipsis when text overflows
                    whiteSpace: 'nowrap',  // Prevent text from wrapping
                    [theme.breakpoints.down('md')]: {
                        maxWidth: '150px',  // Apply maxWidth on smaller screens
                    },
                    [theme.breakpoints.down('sm')]: {
                        width: '112px'
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

                                {/* <TableCell>
                                    <Chip
                                        sx={{
                                            px: "4px",
                                            backgroundColor: product.pbg,
                                            color: "#fff",
                                        }}
                                        size="small"
                                        label={product.priority}
                                    ></Chip>
                                </TableCell> */}

                                <TableCell align="right">
                                    <Typography variant="h6">${product.amount}</Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="h6">${product.account}</Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </DashboardCard>
    );
};

export default ProductPerformance;
